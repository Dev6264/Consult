import { NextRequest, NextResponse } from "next/server";
import { logAudit } from "../../../../../lib/audit";

export async function POST(request: NextRequest) {
  try {
    const { caseId, visited } = await request.json();
    if (!visited) {
      return NextResponse.json({ error: "Recipient has not interacted with the page yet." }, { status: 400 });
    }
    const deliveryId = `aud_${Math.random().toString(36).slice(2, 10)}`;
    const audioSentAt = new Date().toISOString();
    await logAudit(caseId, "whatsapp_audio_sent", { deliveryId, audio_sent_at: audioSentAt });
    return NextResponse.json({ delivery_id: deliveryId, message: "Audio follow-up sent.", audio_sent_at: audioSentAt });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
