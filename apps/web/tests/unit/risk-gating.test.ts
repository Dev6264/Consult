import { describe, expect, test } from 'vitest';
import { canPublishWithRisk } from '@/lib/publishRules';

describe('risk gate', () => {
  test('high risk not publish when not verified', () => expect(canPublishWithRisk('HIGH_RISK', 'SUBMITTED')).toBe(false));
  test('high risk publish when verified', () => expect(canPublishWithRisk('HIGH_RISK', 'VERIFIED')).toBe(true));
});
