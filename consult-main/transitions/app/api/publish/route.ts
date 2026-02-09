import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { publishRequirements } from "../../../lib/validation";
import { logAudit } from "../../../lib/audit";
import { parseRequestBody } from "../../../lib/request";

export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody<{ caseId?: string; forceUnpublish?: string }>(request);
    const caseId = body.caseId as string;
    if (!caseId) throw new Error("caseId is required");
    const forceUnpublish = body.forceUnpublish === "true";

    const caseItem = await prisma.case.findUnique({
      where: { id: caseId },
      include: { deceased: true, events: true, media: true }
    });
    if (!caseItem || !caseItem.deceased) throw new Error("Case not found");

    if (forceUnpublish) {
      await prisma.case.update({
        where: { id: caseId },
        data: { status: "draft", verified: false, publishedAt: null }
      });
      await logAudit(caseId, "case_unpublished", {});
      return NextResponse.redirect(new URL(`/admin/${caseId}`, request.url));
    }

    const hasEvent = caseItem.events.length > 0 && caseItem.events.every((event) => event.startIso && event.venue && event.mapUrl);
    const hasImage = Boolean(caseItem.media?.portraitRetouchedUrl || caseItem.media?.cardOgUrl);

    publishRequirements.parse({
      consentAttestation: caseItem.consentAttestation,
      deceasedName: caseItem.deceased.fullName,
      dod: caseItem.deceased.dod,
      hasEvent,
      hasImage
    });

    if (caseItem.package !== "announcement" && caseItem.paymentStatus !== "paid") {
      throw new Error("Payment required before publishing this package tier.");
    }

    await prisma.case.update({
      where: { id: caseId },
      data: {
        status: "pending_verification",
        verified: false,
        publishedAt: new Date()
      }
    });

    const publicUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/cases/${caseItem.slug}`;
    await logAudit(caseId, "case_submitted_for_verification", { publicUrl });

    return NextResponse.json({ publicUrl });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
