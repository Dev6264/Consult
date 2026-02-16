import fs from "fs/promises";
import path from "path";
import { prisma } from "./prisma";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function rebuildRssFeed() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const feedPath = path.join(process.cwd(), "public", "feed.xml");
  const liveCases = await prisma.case.findMany({
    where: { status: "live" },
    include: { deceased: true },
    orderBy: { updatedAt: "desc" },
    take: 50
  });

  const items = liveCases
    .map((caseItem: { slug: string; publishedAt: Date | null; updatedAt: Date; deceased: { fullName: string } | null }) => {
      const title = escapeXml(caseItem.deceased?.fullName ?? caseItem.slug);
      const link = `${baseUrl}/cases/${caseItem.slug}`;
      return [
        "<item>",
        `<title>${title}</title>`,
        `<link>${escapeXml(link)}</link>`,
        `<guid>${escapeXml(link)}</guid>`,
        `<pubDate>${(caseItem.publishedAt ?? caseItem.updatedAt).toUTCString()}</pubDate>`,
        "</item>"
      ].join("");
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Transitions Feed</title><link>${escapeXml(baseUrl)}</link><description>Published memorials from Transitions</description>${items}</channel></rss>`;

  await fs.mkdir(path.dirname(feedPath), { recursive: true });
  await fs.writeFile(feedPath, xml, "utf-8");
  return xml;
}
