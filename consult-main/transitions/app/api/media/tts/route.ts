import { NextRequest, NextResponse } from "next/server";
import { generatePlaceholderMedia } from "../../../../lib/utils";
import { prisma } from "../../../../lib/prisma";
import { logAudit } from "../../../../lib/audit";

export async function POST(request: NextRequest) {
  try {
    const { caseId } = await request.json();
    const media = await generatePlaceholderMedia(caseId);
    const record = await prisma.media.upsert({
      where: { caseId },
      update: {
        audioEnUrl: media.audioEnUrl,
        audioSwUrl: media.audioSwUrl
      },
      create: {
        caseId,
        portraitRetouchedUrl: media.portraitRetouchedUrl,
        cardSqUrl: media.cardSqUrl,
        cardOgUrl: media.cardOgUrl,
        audioEnUrl: media.audioEnUrl,
        audioSwUrl: media.audioSwUrl
      }
    });
    await logAudit(caseId, "media_audio_generated", media);
    return NextResponse.json(record);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
