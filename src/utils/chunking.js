function splitSentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
}

/**
 * Sentence-aware chunking with overlap and recursive fallback.
 * @param {string} text
 * @param {{maxWords?: number, overlapWords?: number}} options
 * @returns {string[]}
 */
export function chunkText(text, options = {}) {
  const maxWords = options.maxWords ?? 180;
  const overlapWords = options.overlapWords ?? 24;
  const sentences = splitSentences(String(text));

  if (!sentences.length) return [];

  const chunks = [];
  let current = [];

  const flushChunk = () => {
    if (!current.length) return;
    chunks.push(current.join(' ').trim());
    const overlap = current.join(' ').split(/\s+/).slice(-overlapWords).join(' ');
    current = overlap ? [overlap] : [];
  };

  sentences.forEach((sentence) => {
    const words = sentence.split(/\s+/);
    if (words.length > maxWords) {
      for (let i = 0; i < words.length; i += maxWords - overlapWords) {
        const windowWords = words.slice(i, i + maxWords).join(' ');
        if (windowWords) chunks.push(windowWords);
        if (i + maxWords >= words.length) break;
      }
      return;
    }

    const nextWords = [...current.join(' ').split(/\s+/).filter(Boolean), ...words].length;
    if (nextWords > maxWords) flushChunk();
    current.push(sentence);
  });

  if (current.length) chunks.push(current.join(' ').trim());
  return chunks.filter(Boolean);
}
