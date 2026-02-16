import { prisma } from "./prisma";

export async function logAudit(caseId: string | null, event: string, meta: Record<string, unknown>) {
  return prisma.auditLog.create({
    data: {
      caseId,
      event,
      meta
    }
  });
}
