import { describe, expect, test } from 'vitest';
import { canTransition } from '@/lib/workflow';
import { canPublishWithRisk } from '@/lib/publishRules';

describe('draft to publish flow logic', () => {
  test('requires staged transitions', () => {
    expect(canTransition('DRAFT' as any, 'SUBMITTED' as any)).toBe(true);
    expect(canTransition('SUBMITTED' as any, 'VERIFIED' as any)).toBe(true);
    expect(canPublishWithRisk('NORMAL', 'VERIFIED')).toBe(true);
  });
});
