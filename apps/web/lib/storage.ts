import fs from 'node:fs/promises';
import path from 'node:path';

const base = path.join(process.cwd(), 'uploads');

export async function savePrivateFile(buffer: Buffer, fileName: string) {
  await fs.mkdir(base, { recursive: true });
  const clean = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '')}`;
  const filePath = path.join(base, clean);
  await fs.writeFile(filePath, buffer);
  return filePath;
}
