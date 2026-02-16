import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { logAudit } from "../../../../../lib/audit";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = await request.json();
    const copyDeck = await prisma.copyDeck.upsert({
      where: { caseId: params.id },
      update: {
        copyShortEn: payload.copyShortEn,
        copyShortSw: payload.copyShortSw,
        copyLong: payload.copyLong,
        radio15: payload.radio15,
        radio30: payload.radio30
      },
      create: {
        caseId: params.id,
        copyShortEn: payload.copyShortEn,
        copyShortSw: payload.copyShortSw,
        copyLong: payload.copyLong,
        radio15: payload.radio15,
        radio30: payload.radio30
      }
    });
    await logAudit(params.id, "copy_updated", {});
    return NextResponse.json(copyDeck);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
