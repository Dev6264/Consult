import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { rebuildRssFeed } from "../../lib/rss";

export async function GET() {
  const feedPath = path.join(process.cwd(), "public", "feed.xml");
  try {
    const data = await fs.readFile(feedPath, "utf-8");
    return new NextResponse(data, {
      headers: { "Content-Type": "application/rss+xml" }
    });
  } catch {
    const data = await rebuildRssFeed();
    return new NextResponse(data, {
      headers: { "Content-Type": "application/rss+xml" }
    });
  }
}
