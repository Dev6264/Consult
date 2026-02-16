import { NextResponse } from "next/server";
import { generateContentPack } from "../../../../../lib/utils";
import { logAudit } from "../../../../../lib/audit";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const buffer = await generateContentPack(params.id);
    await logAudit(params.id, "content_pack_downloaded", { size: buffer.length });
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=transitions-${params.id}.zip`
      }
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
