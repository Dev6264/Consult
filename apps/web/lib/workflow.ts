type ObituaryStatus = 'DRAFT'|'SUBMITTED'|'SUBMITTED_HIGH_RISK'|'NEEDS_INFO'|'VERIFIED'|'PUBLISHED'|'REJECTED';
const allowed: Record<ObituaryStatus, ObituaryStatus[]> = { DRAFT:['SUBMITTED','SUBMITTED_HIGH_RISK','REJECTED'], SUBMITTED:['NEEDS_INFO','VERIFIED','REJECTED'], SUBMITTED_HIGH_RISK:['NEEDS_INFO','VERIFIED','REJECTED'], NEEDS_INFO:['SUBMITTED','SUBMITTED_HIGH_RISK','REJECTED'], VERIFIED:['PUBLISHED','REJECTED'], PUBLISHED:['REJECTED'], REJECTED:[] };
export function canTransition(from: ObituaryStatus, to: ObituaryStatus) { return allowed[from].includes(to); }
