import { describe, expect, test } from 'vitest';
import { canTransition } from '@/lib/workflow';

describe('workflow transitions', () => {
  test('allows submitted to verified', () => expect(canTransition('SUBMITTED' as any, 'VERIFIED' as any)).toBe(true));
  test('blocks draft to published', () => expect(canTransition('DRAFT' as any, 'PUBLISHED' as any)).toBe(false));
});
