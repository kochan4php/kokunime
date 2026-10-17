import http from "http";

async function measureEndpoint(url, totalRequests = 30, concurrency = 10) {
  console.log(`\n🚀 Starting load test for: ${url}`);
  console.log(`   Requests: ${totalRequests} | Concurrency: ${concurrency}`);

  const startTotal = performance.now();
  let completed = 0;
  let successful = 0;
  const latencies = [];

  const runRequest = () =>
    new Promise((resolve) => {
      const start = performance.now();
      http
        .get(url, (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            const duration = performance.now() - start;
            latencies.push(duration);
            completed++;
            if (res.statusCode >= 200 && res.statusCode < 400) successful++;
            resolve();
          });
        })
        .on("error", () => {
          completed++;
          resolve();
        });
    });

  // Run in concurrent chunks
  for (let i = 0; i < totalRequests; i += concurrency) {
    const chunk = [];
    for (let j = 0; j < concurrency && i + j < totalRequests; j++) {
      chunk.push(runRequest());
    }
    await Promise.all(chunk);
  }

  const totalDuration = (performance.now() - startTotal) / 1000;
  const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length || 0;
  latencies.sort((a, b) => a - b);
  const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
  const rps = (totalRequests / totalDuration).toFixed(2);

  console.log(`   ✓ Completed: ${completed}/${totalRequests} (${successful} OK)`);
  console.log(`   ⏱️ Total Time: ${totalDuration.toFixed(2)}s | RPS: ${rps}`);
  console.log(`   📊 Latency Avg: ${avgLatency.toFixed(2)}ms | p95: ${p95.toFixed(2)}ms`);

  return { completed, successful, p95, successRate: completed > 0 ? successful / completed : 0 };
}

// Thresholds turn this into a gate (CI/cron): nonzero exit = budget missed.
const P95_BUDGET_MS = Number(process.env.LOAD_P95_BUDGET_MS || 1500);
const MIN_SUCCESS_RATE = Number(process.env.LOAD_MIN_SUCCESS_RATE || 0.99);

const targetUrl = process.argv[2] || "http://localhost:3000/api/health";
measureEndpoint(targetUrl)
  .then((result) => {
    const problems = [];
    if (result.p95 > P95_BUDGET_MS) problems.push(`p95 ${result.p95.toFixed(0)}ms > budget ${P95_BUDGET_MS}ms`);
    if (result.successRate < MIN_SUCCESS_RATE)
      problems.push(`success rate ${(result.successRate * 100).toFixed(1)}% < ${MIN_SUCCESS_RATE * 100}%`);

    if (problems.length > 0) {
      console.error(`\n✗ Load budget missed: ${problems.join("; ")}`);
      process.exit(1);
    }
    console.log(`\n✓ Load budget met (p95 ≤ ${P95_BUDGET_MS}ms, success ≥ ${MIN_SUCCESS_RATE * 100}%)`);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
