import { NextRequest, NextResponse } from "next/server";
import { logAudit } from "../../../../lib/audit";
import { parseRequestBody } from "../../../../lib/request";

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody<{ caseId?: string; event?: string; meta?: string }>(request);
    let meta: Record<string, unknown> = {};
    if (body.meta) {
      try {
        meta = JSON.parse(body.meta);
      } catch {
        meta = { note: body.meta };
      }
    }
    const log = await logAudit(body.caseId ?? null, body.event ?? "manual", meta);
    if (request.headers.get("content-type")?.includes("application/x-www-form-urlencoded")) {
      return NextResponse.redirect(new URL(`/admin/${body.caseId}`, request.url));
    }
    return NextResponse.json(log);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
