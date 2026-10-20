import { VITALS_THRESHOLDS, type VitalName } from "./vitals-thresholds";

interface VitalsPayload {
  name: VitalName;
  value: number;
  path: string;
  deviceType?: string | undefined;
  connection?: string | undefined;
}

const VALID_NAMES = new Set<string>(Object.keys(VITALS_THRESHOLDS));
const DEVICES = new Set(["mobile", "desktop", "tablet"]);
// Network Information API effectiveType values; anything else is dropped.
const CONNECTIONS = new Set(["slow-2g", "2g", "3g", "4g"]);
const MAX_VALUE = 60_000;

// Trust boundary for client RUM samples: reject unknown metrics and absurd
// values, and keep optional dimensions inside fixed allowlists.
export const parseVitalsPayload = (body: unknown): VitalsPayload | null => {
  if (!body || typeof body !== "object") return null;
  const { name, value, path, deviceType, connection } = body as Record<string, unknown>;

  if (typeof name !== "string" || !VALID_NAMES.has(name)) return null;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > MAX_VALUE) return null;
  if (typeof path !== "string" || !path.startsWith("/")) return null;

  // Never persist raw search terms: /search/<query> is user input and would
  // otherwise show up on the public /status table and in webhook alerts.
  const cleanPath = path.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 200);

  return {
    name: name as VitalName,
    value,
    path: cleanPath.startsWith("/search/") ? "/search/[query]" : cleanPath,
    deviceType: typeof deviceType === "string" && DEVICES.has(deviceType) ? deviceType : undefined,
    connection: typeof connection === "string" && CONNECTIONS.has(connection) ? connection : undefined,
  };
};
