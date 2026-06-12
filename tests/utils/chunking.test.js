import { describe, expect, it } from 'vitest';
import { chunkText } from '../../src/utils/chunking';

describe('chunkText', () => {
  it('returns sentence-aware chunks', () => {
    const chunks = chunkText('One short sentence. Two short sentences. Three short sentences.', {
      maxWords: 4,
      overlapWords: 1,
    });

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0]).toContain('One short sentence.');
  });
});
