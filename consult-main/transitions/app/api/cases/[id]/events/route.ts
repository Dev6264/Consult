import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { eventSchema } from "../../../../../lib/validation";
import { logAudit } from "../../../../../lib/audit";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = eventSchema.parse(await request.json());
    const event = await prisma.event.create({
      data: {
        caseId: params.id,
        ...payload
      }
    });
    await logAudit(params.id, "event_added", { eventId: event.id, type: event.type });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
