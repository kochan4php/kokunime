import { NextResponse } from "next/server";

interface ProblemOptions {
  status: number;
  title: string;
  detail?: string;
  requestId?: string;
  headers?: Record<string, string>;
}

// RFC 9457 problem+json with a legacy `error` field kept for existing API
// clients (Discord/Telegram bots parse `error` today). New integrations should
// read `title`/`detail`.
export const problemResponse = (options: ProblemOptions): NextResponse => {
  const detail = options.detail ?? options.title;
  const body: Record<string, unknown> = {
    type: `https://httpstatuses.io/${options.status}`,
    title: options.title,
    status: options.status,
    detail,
    error: detail,
  };
  if (options.requestId) body.requestId = options.requestId;

  return new NextResponse(JSON.stringify(body), {
    status: options.status,
    headers: { "Content-Type": "application/problem+json", ...options.headers },
  });
};
