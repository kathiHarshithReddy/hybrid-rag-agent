import { generateEmbeddings } from './embedding.js';

/**
 * @param {number[]} a
 * @param {number[]} b
 * @returns {number}
 */
export function cosineSimilarity(a, b) {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < Math.min(a.length, b.length); i += 1) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB) + 1e-8);
}

/**
 * Rank chunks by similarity against a query.
 * @param {string} query
 * @param {{text: string, source: string}[]} chunks
 * @param {number} topK
 */
export function rankChunks(query, chunks, topK = 4) {
  if (!chunks.length) return [];

  const [queryEmbedding] = generateEmbeddings([query]);
  const chunkEmbeddings = generateEmbeddings(chunks.map((chunk) => chunk.text));

  return chunkEmbeddings
    .map((embedding, index) => ({
      ...chunks[index],
      score: cosineSimilarity(queryEmbedding, embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
