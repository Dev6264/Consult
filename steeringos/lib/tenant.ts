import { NextRequest } from "next/server";

export function getStoreId(request: NextRequest): string | null {
  return request.headers.get("x-store-id");
}

export function enforceStoreId(request: NextRequest): string {
  const storeId = getStoreId(request);
  if (!storeId) {
    throw new Error("Missing store context");
  }
  return storeId;
}
