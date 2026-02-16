import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

function buildIcs({ title, startIso, location }: { title: string; startIso: string; location: string }) {
  const start = new Date(startIso);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const toIcs = (date: Date) => date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Transitions//Obituary Events//EN",
    "BEGIN:VEVENT",
    `UID:${Math.random().toString(36).slice(2)}@transitions`,
    `DTSTAMP:${toIcs(new Date())}`,
    `DTSTART:${toIcs(start)}`,
    `DTEND:${toIcs(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({ where: { id: params.id } });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
  const ics = buildIcs({
    title: `Transitions ${event.type}`,
    startIso: event.startIso,
    location: event.venue
  });
  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar",
      "Content-Disposition": `attachment; filename=${event.type}.ics`
    }
  });
}
