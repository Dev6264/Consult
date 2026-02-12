import slugify from 'slugify';
import { prisma } from './prisma';

const heuristicTerms = ['president', 'governor', 'senator', 'bishop', 'minister'];
export function makeSlug(name: string) { return slugify(name, { lower: true, strict: true }); }

export async function evaluateRisk(fullName: string) {
  const watch = await prisma.watchlistName.findFirst({ where: { name: { equals: fullName, mode: 'insensitive' } } });
  if (watch) return { riskFlag: 'WATCHLIST_MATCH', highRisk: true, reason: 'watchlist' };
  const lower = fullName.toLowerCase();
  if (heuristicTerms.some((term) => lower.includes(term)) || fullName.trim().split(' ').length >= 4) return { riskFlag: 'POSSIBLE_PUBLIC_FIGURE', highRisk: true, reason: 'heuristic' };
  return { riskFlag: 'NORMAL', highRisk: false, reason: 'normal' };
}

export async function checkDuplicate(fullName: string, county: string, dod?: Date) {
  if (!dod) return false;
  return Boolean(await prisma.obituary.findFirst({ where: { fullName, county, dod } }));
}
