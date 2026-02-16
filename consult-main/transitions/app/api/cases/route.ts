import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { caseCreateSchema } from "../../../lib/validation";
import { generatePlaceholderMedia, generateProgramPdf } from "../../../lib/utils";
import { logAudit } from "../../../lib/audit";

export async function POST(request: NextRequest) {
  try {
    const payload = caseCreateSchema.parse(await request.json());
    const caseRecord = await prisma.case.create({
      data: {
        slug: payload.slug,
        package: payload.package,
        status: "draft",
        consentAttestation: payload.consentAttestation,
        privacy: payload.privacy,
        noindex: payload.noindex,
        organizer: {
          create: payload.organizer
        },
        deceased: {
          create: {
            fullName: payload.deceased.fullName,
            dob: payload.deceased.dob,
            dod: payload.deceased.dod,
            faith: payload.deceased.faith,
            shortBio: payload.deceased.shortBio
          }
        },
        events: {
          create: payload.events
        }
      }
    });

    await prisma.copyDeck.create({
      data: {
        caseId: caseRecord.id,
        copyShortEn: payload.copyShortEn,
        copyShortSw: payload.copyShortSw,
        copyLong: payload.copyLong,
        radio15: payload.radio15,
        radio30: payload.radio30
      }
    });

    const media = await generatePlaceholderMedia(caseRecord.id);
    const publicUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/cases/${caseRecord.slug}`;
    const programPdfUrl = await generateProgramPdf(caseRecord.id, publicUrl);
    await prisma.media.create({
      data: {
        caseId: caseRecord.id,
        ...media,
        programPdfUrl
      }
    });

    await logAudit(caseRecord.id, "case_created", { organizer: payload.organizer.fullName });
    if (payload.consentAttestation) {
      await logAudit(caseRecord.id, "consent_attested", { by: payload.organizer.fullName });
    }

    return NextResponse.json({ id: caseRecord.id });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
