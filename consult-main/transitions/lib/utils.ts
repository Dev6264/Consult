import fs from "fs/promises";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import JSZip from "jszip";
import { prisma } from "./prisma";

type GeneratedMedia = {
  portraitRetouchedUrl: string;
  cardSqUrl: string;
  cardOgUrl: string;
  audioEnUrl: string;
  audioSwUrl: string;
};

const uploadsDir = path.join(process.cwd(), "public", "uploads");

async function ensureUploadsDir() {
  await fs.mkdir(uploadsDir, { recursive: true });
}

async function writePlaceholderFile(name: string, contents: string) {
  await ensureUploadsDir();
  const absolutePath = path.join(uploadsDir, name);
  await fs.writeFile(absolutePath, contents, "utf-8");
  return `/uploads/${name}`;
}

export async function generatePlaceholderMedia(caseId: string): Promise<GeneratedMedia> {
  const base = caseId.slice(0, 8);

  const portraitRetouchedUrl = await writePlaceholderFile(`${base}-portrait.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080"><rect width="100%" height="100%" fill="#0f172a"/><text x="50%" y="50%" fill="#e2e8f0" font-size="48" text-anchor="middle" dominant-baseline="middle">Portrait ${base}</text></svg>`);
  const cardSqUrl = await writePlaceholderFile(`${base}-card-square.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200"><rect width="100%" height="100%" fill="#1e293b"/><text x="50%" y="50%" fill="#f8fafc" font-size="52" text-anchor="middle" dominant-baseline="middle">Card Square ${base}</text></svg>`);
  const cardOgUrl = await writePlaceholderFile(`${base}-card-og.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="100%" height="100%" fill="#334155"/><text x="50%" y="50%" fill="#f8fafc" font-size="44" text-anchor="middle" dominant-baseline="middle">OG Card ${base}</text></svg>`);

  const audioStub = "Placeholder audio metadata for deterministic stub output.";
  const audioEnUrl = await writePlaceholderFile(`${base}-audio-en.mp3`, audioStub);
  const audioSwUrl = await writePlaceholderFile(`${base}-audio-sw.mp3`, audioStub);

  return { portraitRetouchedUrl, cardSqUrl, cardOgUrl, audioEnUrl, audioSwUrl };
}

export async function generateProgramPdf(caseId: string, publicUrl: string): Promise<string> {
  await ensureUploadsDir();

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const qrDataUrl = await QRCode.toDataURL(publicUrl);
  const qrImage = await pdf.embedPng(qrDataUrl);

  page.drawText("Transitions Program", { x: 50, y: 780, size: 24, font, color: rgb(0.1, 0.1, 0.1) });
  page.drawText(`Case ID: ${caseId}`, { x: 50, y: 750, size: 12, font, color: rgb(0.2, 0.2, 0.2) });
  page.drawText(`Public URL: ${publicUrl}`, { x: 50, y: 730, size: 10, font, color: rgb(0.25, 0.25, 0.25) });
  page.drawImage(qrImage, { x: 50, y: 590, width: 120, height: 120 });

  const pdfBytes = await pdf.save();
  const fileName = `${caseId.slice(0, 8)}-program.pdf`;
  await fs.writeFile(path.join(uploadsDir, fileName), pdfBytes);
  return `/uploads/${fileName}`;
}

export async function generateContentPack(caseId: string): Promise<Buffer> {
  const caseItem = await prisma.case.findUnique({
    where: { id: caseId },
    include: {
      organizer: true,
      deceased: true,
      events: true,
      media: true,
      copyDeck: true
    }
  });

  if (!caseItem) throw new Error("Case not found");

  const zip = new JSZip();

  const profile = {
    schemaVersion: "v2",
    case: {
      id: caseItem.id,
      slug: caseItem.slug,
      status: caseItem.status,
      package: caseItem.package,
      privacy: caseItem.privacy,
      noindex: caseItem.noindex,
      publishedAt: caseItem.publishedAt
    },
    organizer: caseItem.organizer,
    deceased: caseItem.deceased,
    events: caseItem.events,
    copyDeck: caseItem.copyDeck,
    media: caseItem.media
  };

  zip.file("profile.json", JSON.stringify(profile, null, 2));

  if (caseItem.media) {
    const mediaPaths = [
      caseItem.media.portraitRetouchedUrl,
      caseItem.media.cardSqUrl,
      caseItem.media.cardOgUrl,
      caseItem.media.audioEnUrl,
      caseItem.media.audioSwUrl,
      caseItem.media.programPdfUrl
    ].filter(Boolean) as string[];

    for (const mediaPath of mediaPaths) {
      const absolutePath = path.join(process.cwd(), "public", mediaPath.replace(/^\//, ""));
      try {
        const data = await fs.readFile(absolutePath);
        zip.file(path.basename(mediaPath), data);
      } catch {
        zip.file(`${path.basename(mediaPath)}.missing.txt`, `Missing asset placeholder for ${mediaPath}`);
      }
    }
  }

  return zip.generateAsync({ type: "nodebuffer" });
}

export function formatKenyaDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi"
  }).format(date);
}

export function buildWhatsAppShare(message: string, url: string) {
  const text = `${message}\n${url}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
