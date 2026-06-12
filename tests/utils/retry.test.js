import { describe, expect, it } from 'vitest';
import { withRetry } from '../../src/utils/retry';

describe('withRetry', () => {
  it('retries and eventually succeeds', async () => {
    let count = 0;
    const value = await withRetry(async () => {
      count += 1;
      if (count < 2) throw new Error('temporary');
      return 'ok';
    }, { retries: 2, baseDelayMs: 1 });

    expect(value).toBe('ok');
    expect(count).toBe(2);
  });
});
