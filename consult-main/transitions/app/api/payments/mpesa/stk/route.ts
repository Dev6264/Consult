import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { logAudit } from "../../../../../lib/audit";

export async function POST(request: NextRequest) {
  try {
    const { caseId, amount } = await request.json();
    const receiptId = `MPESA-${Math.floor(Math.random() * 1000000)}`;
    await prisma.case.update({
      where: { id: caseId },
      data: {
        paymentStatus: "paid",
        receiptId
      }
    });
    await logAudit(caseId, "mpesa_stk_stub", { amount, receiptId });
    return NextResponse.json({ message: "STK push simulated", receiptId });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
