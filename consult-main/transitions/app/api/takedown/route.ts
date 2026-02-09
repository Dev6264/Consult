import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { logAudit } from "../../../lib/audit";
import { parseRequestBody } from "../../../lib/request";

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody<{
      caseId?: string;
      url?: string;
      requesterName?: string;
      requesterPhone?: string;
      reason?: string;
    }>(request);
    if (!body.url || !body.requesterName || !body.requesterPhone || !body.reason) {
      throw new Error("Missing takedown fields");
    }
    const takedown = await prisma.takedownRequest.create({
      data: {
        caseId: body.caseId ?? null,
        url: body.url,
        requesterName: body.requesterName,
        requesterPhone: body.requesterPhone,
        reason: body.reason,
        status: "open"
      }
    });
    await logAudit(body.caseId ?? null, "takedown_requested", { url: body.url });
    if (request.headers.get("content-type")?.includes("application/x-www-form-urlencoded")) {
      return NextResponse.redirect(new URL(body.url, request.url));
    }
    return NextResponse.json({ id: takedown.id });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
