# Hybrid RAG Agent

Production-ready Hybrid RAG Agent with local document retrieval and Claude fallback.

## Features
- React frontend with chat, document management, and error boundary
- Express backend with `/api/index`, `/api/embed`, `/api/ask`
- Utility modules for chunking, embedding, similarity scoring, API retries
- GitHub Actions workflows for lint/test/deploy
- Vercel and Netlify deployment configs

## Quick start
```bash
npm install
npm run server
npm run dev
```

Copy `.env.example` to `.env` and set:
- `ANTHROPIC_API_KEY`
- `INTERNAL_API_KEY` (optional)
- `VITE_API_BASE_URL`

## Scripts
- `npm run dev`
- `npm run server`
- `npm run lint`
- `npm run test`
- `npm run build`

## Docs
- `docs/ARCHITECTURE.md`
- `docs/API.md`
- `docs/DEPLOYMENT.md`
- `docs/SECURITY.md`
