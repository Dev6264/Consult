import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { rsvpSchema } from "../../../../../lib/validation";
import { logAudit } from "../../../../../lib/audit";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = rsvpSchema.parse(await request.json());
    const rsvp = await prisma.rsvp.create({
      data: {
        caseId: params.id,
        name: payload.name,
        phone: payload.phone,
        status: payload.status,
        headcount: payload.headcount
      }
    });
    await logAudit(params.id, "rsvp_received", { status: payload.status, headcount: payload.headcount });
    return NextResponse.json(rsvp);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
