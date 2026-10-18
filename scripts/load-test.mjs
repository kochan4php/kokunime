import http from "http";

// Load-test modes:
//   --mode=quick      (default) fixed burst; gates on budget
//   --mode=spike      short high-concurrency burst; gates on budget
//   --mode=soak       sustained traffic for SOAK_SECONDS; gates on budget
//   --mode=breakpoint ramps concurrency until the budget breaks (report only)
// Budgets come from env: LOAD_P95_BUDGET_MS (1500), LOAD_MIN_SUCCESS_RATE (0.99).
const P95_BUDGET_MS = Number(process.env.LOAD_P95_BUDGET_MS || 1500);
const MIN_SUCCESS_RATE = Number(process.env.LOAD_MIN_SUCCESS_RATE || 0.99);
const SOAK_SECONDS = Number(process.env.LOAD_SOAK_SECONDS || 45);

const MODES = {
  quick: { totalRequests: 30, concurrency: 10 },
  spike: { totalRequests: 150, concurrency: 25 },
  soak: { concurrency: 8, durationMs: SOAK_SECONDS * 1000 },
  breakpoint: { totalRequests: 40, concurrency: 5 },
};

const args = process.argv.slice(2);
const modeArg = args.find((a) => a.startsWith("--mode="));
const mode = (modeArg ? modeArg.split("=")[1] : "quick").replace(/^--mode=/, "");
const routesArg = args.find((a) => a.startsWith("--routes="));
const baseUrl =
  process.env.LOAD_BASE || args.find((a) => !a.startsWith("--") && a.startsWith("http")) || "http://localhost:3000";
// Multiple routes: --routes=/api/health,/api/trending (each gets the full
// burst; the run fails if any route misses the budget). A bare positional URL
// still selects a single target.
const targetUrls = routesArg
  ? routesArg
      .split("=")[1]
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => (entry.startsWith("http") ? entry : `${baseUrl}${entry.startsWith("/") ? "" : "/"}${entry}`))
  : [args.find((a) => !a.startsWith("--")) || `${baseUrl}/api/health`];

if (!MODES[mode]) {
  console.error(`✗ Unknown mode "${mode}". Use quick | spike | soak | breakpoint.`);
  process.exit(2);
}

function singleRequest(url) {
  return new Promise((resolve) => {
    const start = performance.now();
    http
      .get(url, (res) => {
        res.resume();
        res.on("end", () => {
          resolve({ duration: performance.now() - start, ok: res.statusCode >= 200 && res.statusCode < 400 });
        });
      })
      .on("error", () => resolve({ duration: performance.now() - start, ok: false }));
  });
}

async function runLoad(url, { totalRequests, concurrency, durationMs }) {
  const latencies = [];
  let completed = 0;
  let successful = 0;
  const startTotal = performance.now();

  const chunk = async (size) => {
    await Promise.all(
      Array.from({ length: size }, async () => {
        const result = await singleRequest(url);
        latencies.push(result.duration);
        completed++;
        if (result.ok) successful++;
      }),
    );
  };

  if (durationMs) {
    // Soak: keep `concurrency` in flight until the duration elapses.
    while (performance.now() - startTotal < durationMs) {
      await chunk(concurrency);
    }
  } else {
    for (let i = 0; i < totalRequests; i += concurrency) {
      await chunk(Math.min(concurrency, totalRequests - i));
    }
  }

  const totalDuration = (performance.now() - startTotal) / 1000;
  latencies.sort((a, b) => a - b);
  const avgLatency = latencies.reduce((a, b) => a + b, 0) / (latencies.length || 1);
  const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;

  return {
    completed,
    successful,
    p95,
    avgLatency,
    rps: completed / totalDuration,
    successRate: completed > 0 ? successful / completed : 0,
    totalDuration,
  };
}

const summarise = (label, result) =>
  `${label}: ${result.completed} req in ${result.totalDuration.toFixed(2)}s | RPS ${result.rps.toFixed(1)} | ` +
  `avg ${result.avgLatency.toFixed(0)}ms | p95 ${result.p95.toFixed(0)}ms | ok ${(result.successRate * 100).toFixed(1)}%`;

const budgetProblems = (result) => {
  const problems = [];
  if (result.p95 > P95_BUDGET_MS) problems.push(`p95 ${result.p95.toFixed(0)}ms > budget ${P95_BUDGET_MS}ms`);
  if (result.successRate < MIN_SUCCESS_RATE)
    problems.push(`success rate ${(result.successRate * 100).toFixed(1)}% < ${MIN_SUCCESS_RATE * 100}%`);
  return problems;
};

const main = async () => {
  console.log(`\n🚀 Load test [${mode}] → ${targetUrls.join(", ")}`);
  console.log(`   Budget: p95 ≤ ${P95_BUDGET_MS}ms, success ≥ ${MIN_SUCCESS_RATE * 100}%\n`);

  if (mode === "breakpoint") {
    // Ramp concurrency until the budget breaks; informational by design.
    const targetUrl = targetUrls[0];
    let lastGood = 0;
    let breaking = null;
    for (const concurrency of [5, 10, 20, 40, 80]) {
      const result = await runLoad(targetUrl, { totalRequests: MODES.breakpoint.totalRequests, concurrency });
      console.log(summarise(`concurrency ${concurrency}`, result));
      const problems = budgetProblems(result);
      if (problems.length > 0) {
        breaking = { concurrency, problems };
        console.log(`   ✗ budget broken at concurrency ${concurrency}: ${problems.join("; ")}`);
        break;
      }
      lastGood = concurrency;
    }

    if (breaking) {
      console.log(`\n📉 Breaking point: between concurrency ${lastGood} (ok) and ${breaking.concurrency} (broken).`);
    } else {
      console.log(`\n📈 No breaking point up to concurrency 80 — budget holds at every step.`);
    }
    process.exit(0);
  }

  const failures = [];
  for (const targetUrl of targetUrls) {
    const result = await runLoad(targetUrl, MODES[mode]);
    console.log(summarise(targetUrl, result));
    const problems = budgetProblems(result);
    if (problems.length > 0) failures.push(`${targetUrl}: ${problems.join("; ")}`);
  }

  if (failures.length > 0) {
    console.error(`\n✗ Load budget missed:\n  ${failures.join("\n  ")}`);
    process.exit(1);
  }
  console.log(`\n✓ Load budget met (p95 ≤ ${P95_BUDGET_MS}ms, success ≥ ${MIN_SUCCESS_RATE * 100}%)`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
