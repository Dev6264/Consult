import { NextResponse } from "next/server";
import { rebuildRssFeed } from "../../../../../lib/rss";

export async function POST() {
  const feed = await rebuildRssFeed();
  return NextResponse.json({ message: "RSS feed updated", length: feed.length });
}
