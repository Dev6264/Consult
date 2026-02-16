import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { logAudit } from "../../../../../lib/audit";
import { parseRequestBody } from "../../../../../lib/request";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await parseRequestBody<{ status?: string }>(request);
    const status = body.status ?? "pending_verification";
    const allowed = ["draft", "pending_verification", "live", "rejected"];
    if (!allowed.includes(status)) {
      throw new Error("Invalid status");
    }
    const caseRecord = await prisma.case.update({
      where: { id: params.id },
      data: {
        status,
        verified: status === "live"
      }
    });
    await logAudit(params.id, "verification_status_updated", { status });
    return NextResponse.redirect(new URL(`/admin/${params.id}`, request.url));
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
