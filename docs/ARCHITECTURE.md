# Architecture

The repository follows a modular hybrid RAG architecture:

- **Frontend (React + Vite):** Chat UI, error boundary, and document management.
- **Backend (Express):** `/api/index`, `/api/embed`, and `/api/ask` endpoints.
- **Shared utilities:** Chunking, embedding, similarity ranking, Claude API wrapper, and retry logic.

The backend keeps API keys private and performs external model calls server-side only.
