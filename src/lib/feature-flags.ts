import { isRedisConfigured, redisGet, redisSet } from "@/lib/redis";

// Runtime feature flags: one JSON blob in Redis so a toggle applies without a
// redeploy. Without Redis the flags still toggle (in-memory, resets on restart)
// so local dev and previews behave the same way.
type FeatureFlagKey = "suggest" | "report-vitals";

interface FeatureFlag {
  key: FeatureFlagKey;
  label: string;
  description: string;
  defaultEnabled: boolean;
}

const FLAGS_KEY = "feature-flags";
// Re-set on every toggle; effectively persistent while staying inside redisSet's
// EX-based API (0 would be rejected by Redis).
const FLAGS_TTL_SECONDS = 365 * 24 * 3600;

const FEATURE_FLAG_REGISTRY: FeatureFlag[] = [
  {
    key: "suggest",
    label: "Autocomplete",
    description: "Endpoint /api/suggest mengembalikan saran judul dari indeks lokal.",
    defaultEnabled: true,
  },
  {
    key: "report-vitals",
    label: "Web vitals RUM",
    description: "Endpoint /api/report-vitals menerima sample Core Web Vitals dari browser.",
    defaultEnabled: true,
  },
];

type FlagOverrides = Record<string, boolean>;
let memoryOverrides: FlagOverrides = {};

const readOverrides = async (): Promise<FlagOverrides> => {
  const stored = await redisGet(FLAGS_KEY);
  if (stored && typeof stored === "object" && !Array.isArray(stored)) {
    return stored as FlagOverrides;
  }
  return memoryOverrides;
};

export const getFeatureFlags = async (): Promise<Array<FeatureFlag & { enabled: boolean }>> => {
  const overrides = await readOverrides();
  return FEATURE_FLAG_REGISTRY.map((flag) => {
    const override = overrides[flag.key];
    return {
      ...flag,
      enabled: typeof override === "boolean" ? override : flag.defaultEnabled,
    };
  });
};

export const isFeatureEnabled = async (key: FeatureFlagKey): Promise<boolean> => {
  const overrides = await readOverrides();
  const override = overrides[key];
  if (typeof override === "boolean") return override;
  return FEATURE_FLAG_REGISTRY.find((flag) => flag.key === key)?.defaultEnabled ?? false;
};

export const setFeatureFlag = async (
  key: string,
  enabled: boolean,
): Promise<(FeatureFlag & { enabled: boolean }) | null> => {
  const flag = FEATURE_FLAG_REGISTRY.find((entry) => entry.key === key);
  if (!flag) return null;

  const overrides = { ...(await readOverrides()), [key]: enabled };
  memoryOverrides = overrides;
  if (isRedisConfigured()) await redisSet(FLAGS_KEY, overrides, FLAGS_TTL_SECONDS);
  return { ...flag, enabled };
};
