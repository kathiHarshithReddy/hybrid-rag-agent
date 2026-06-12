import { Router } from 'express';
import { chunkText } from '../../src/utils/chunking.js';
import { generateEmbeddings } from '../../src/utils/embedding.js';
import { rankChunks } from '../../src/utils/similarity.js';
import { callClaude } from '../../src/utils/api.js';

const router = Router();
const RETRIEVAL_THRESHOLD = Number(process.env.RETRIEVAL_THRESHOLD ?? 0.35);
const CONTEXT_SCORE_MULTIPLIER = Number(process.env.CONTEXT_SCORE_MULTIPLIER ?? 0.75);

const state = {
  chunks: [],
};

router.post('/embed', (req, res) => {
  const texts = Array.isArray(req.body?.texts) ? req.body.texts : [];
  return res.json({ embeddings: generateEmbeddings(texts) });
});

router.post('/index', (req, res) => {
  const docs = Array.isArray(req.body?.docs) ? req.body.docs : [];
  state.chunks = docs.flatMap((doc) =>
    chunkText(doc.content).map((text, index) => ({ text, source: doc.name, idx: index, docId: doc.id }))
  );

  return res.json({ indexedChunks: state.chunks.length });
});

router.post('/ask', async (req, res, next) => {
  try {
    const question = String(req.body?.question ?? '').trim();
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const ranked = rankChunks(question, state.chunks, 4);
    const bestScore = ranked[0]?.score ?? 0;
    const useLocal = bestScore >= RETRIEVAL_THRESHOLD;

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured' });
    }

    if (useLocal) {
      const context = ranked
        .filter((entry) => entry.score >= RETRIEVAL_THRESHOLD * CONTEXT_SCORE_MULTIPLIER)
        .map((entry) => `[${entry.source}]\n${entry.text}`)
        .join('\n\n---\n\n');

      const answer = await callClaude({
        apiKey: process.env.ANTHROPIC_API_KEY,
        systemPrompt:
          'You are a precise internal knowledge assistant. Answer only from the provided context. If context is insufficient, say so clearly.',
        userMessage: `Context:\n${context}\n\nQuestion: ${question}`,
      });

      return res.json({ answer, source: { type: 'local', score: bestScore, hits: ranked } });
    }

    const answer = await callClaude({
      apiKey: process.env.ANTHROPIC_API_KEY,
      systemPrompt:
        'You are a knowledgeable assistant. The user question was not found in internal docs. Start your reply with "🌐 From web knowledge:".',
      userMessage: question,
    });

    return res.json({ answer, source: { type: 'web', score: bestScore } });
  } catch (error) {
    return next(error);
  }
});

export default router;
