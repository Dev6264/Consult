export function canPublishWithRisk(riskFlag: string, currentStatus: string) {
  if (riskFlag !== 'NORMAL') return currentStatus === 'VERIFIED';
  return currentStatus === 'VERIFIED';
}
