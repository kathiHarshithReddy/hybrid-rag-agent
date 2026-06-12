import { describe, expect, it } from 'vitest';
import { cosineSimilarity, rankChunks } from '../../src/utils/similarity';

describe('similarity utilities', () => {
  it('calculates cosine similarity', () => {
    expect(cosineSimilarity([1, 0, 0], [1, 0, 0])).toBeCloseTo(1, 5);
  });

  it('ranks chunks by relevance', () => {
    const chunks = [
      { text: 'customer data retention seven years', source: 'policy.txt' },
      { text: 'api retries and timeout setup', source: 'api.txt' },
    ];

    const ranked = rankChunks('data retention policy', chunks, 1);
    expect(ranked[0].source).toBe('policy.txt');
  });
});
