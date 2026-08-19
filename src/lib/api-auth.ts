import { NextRequest } from "next/server";

export interface ApiAuthContext {
  isApiKey: boolean;
  tier: "public" | "developer" | "pro";
  rateLimit: number;
}

export function validateApiAuth(request: NextRequest): ApiAuthContext {
  const headerKey = request.headers.get("x-api-key");
  const queryKey = request.nextUrl.searchParams.get("api_key");
  const apiKey = headerKey || queryKey;

  if (apiKey && apiKey.startsWith("koku_live_")) {
    return {
      isApiKey: true,
      tier: "pro",
      rateLimit: 1000,
    };
  }

  if (apiKey && apiKey.startsWith("koku_dev_")) {
    return {
      isApiKey: true,
      tier: "developer",
      rateLimit: 300,
    };
  }

  return {
    isApiKey: false,
    tier: "public",
    rateLimit: 60,
  };
}
