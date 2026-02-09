import { NextRequest, NextResponse } from "next/server";
import { generatePlaceholderMedia, generateProgramPdf } from "../../../../lib/utils";
import { prisma } from "../../../../lib/prisma";
import { logAudit } from "../../../../lib/audit";

export async function POST(request: NextRequest) {
  try {
    const { caseId } = await request.json();
    const caseItem = await prisma.case.findUnique({ where: { id: caseId } });
    if (!caseItem) throw new Error("Case not found");
    const publicUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/cases/${caseItem.slug}`;
    const programPdfUrl = await generateProgramPdf(caseId, publicUrl);
    const placeholders = await generatePlaceholderMedia(caseId);
    const media = await prisma.media.upsert({
      where: { caseId },
      update: { programPdfUrl },
      create: {
        caseId,
        portraitRetouchedUrl: placeholders.portraitRetouchedUrl,
        cardSqUrl: placeholders.cardSqUrl,
        cardOgUrl: placeholders.cardOgUrl,
        audioEnUrl: placeholders.audioEnUrl,
        audioSwUrl: placeholders.audioSwUrl,
        programPdfUrl
      }
    });
    await logAudit(caseId, "program_pdf_generated", { programPdfUrl });
    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
