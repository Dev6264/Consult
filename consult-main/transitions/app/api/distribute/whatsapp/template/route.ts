import { NextRequest, NextResponse } from "next/server";
import { logAudit } from "../../../../../lib/audit";

export async function POST(request: NextRequest) {
  try {
    const { caseId, message, url } = await request.json();
    const deliveryId = `tmpl_${Math.random().toString(36).slice(2, 10)}`;
    await logAudit(caseId, "whatsapp_template_sent", { deliveryId, message, url });
    return NextResponse.json({ delivery_id: deliveryId });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
