# API Documentation

## POST `/api/index`
Indexes an array of documents.

Request body:
```json
{ "docs": [{ "id": 1, "name": "a.txt", "content": "text" }] }
```

## POST `/api/embed`
Creates deterministic TF-IDF style embeddings for input texts.

## POST `/api/ask`
Answers a question using local retrieval first and Claude fallback.
