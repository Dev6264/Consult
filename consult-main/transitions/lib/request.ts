export async function parseRequestBody<T>(request: Request): Promise<T> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return (await request.json()) as T;
  }

  if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    return Object.fromEntries(form.entries()) as T;
  }

  try {
    return (await request.json()) as T;
  } catch {
    return {} as T;
  }
}
