const RAW_UPSTREAM = process.env.UPSTREAM_URL?.trim() || "https://kusonime.com";
export const UPSTREAM_URL = RAW_UPSTREAM.endsWith("/") ? RAW_UPSTREAM : `${RAW_UPSTREAM}/`;
