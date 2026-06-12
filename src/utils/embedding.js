const VOCAB_SIZE = 512;

function hashToken(token) {
  let hash = 5381;
  for (let i = 0; i < token.length; i += 1) {
    hash = (hash * 33) ^ token.charCodeAt(i);
  }
  return Math.abs(hash) % VOCAB_SIZE;
}

/**
 * Generate normalized TF-IDF style vectors.
 * @param {string[]} texts
 * @returns {number[][]}
 */
export function generateEmbeddings(texts) {
  const documents = texts.map((text) =>
    String(text)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean)
  );

  const docFrequency = new Map();
  documents.forEach((tokens) => {
    const seen = new Set(tokens);
    seen.forEach((token) => docFrequency.set(token, (docFrequency.get(token) ?? 0) + 1));
  });

  const totalDocs = Math.max(documents.length, 1);

  return documents.map((tokens) => {
    const vector = new Array(VOCAB_SIZE).fill(0);
    const tokenCounts = new Map();
    tokens.forEach((token) => tokenCounts.set(token, (tokenCounts.get(token) ?? 0) + 1));

    tokenCounts.forEach((count, token) => {
      const tf = count / Math.max(tokens.length, 1);
      const idf = Math.log((totalDocs + 1) / ((docFrequency.get(token) ?? 0) + 1)) + 1;
      vector[hashToken(token)] += tf * idf;
    });

    const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
    return vector.map((value) => value / norm);
  });
}
