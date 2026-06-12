import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ChatMessage from './ChatMessage';

const initialDocs = [
  {
    id: 1,
    name: 'company-policy.txt',
    content: 'Customer data retention: 7 years after account closure. Audit logs retained for 5 years.',
  },
];

function createMessage(role, content, meta) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    role,
    content,
    meta,
  };
}

export default function HybridRAGAgent() {
  const [docs, setDocs] = useState(initialDocs);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [docName, setDocName] = useState('');
  const [docContent, setDocContent] = useState('');
  const [indexing, setIndexing] = useState(false);
  const bottomRef = useRef(null);

  const apiBase = useMemo(() => import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001', []);

  const indexDocs = useCallback(async () => {
    setIndexing(true);
    try {
      await fetch(`${apiBase}/api/index`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docs }),
      });
    } finally {
      setIndexing(false);
    }
  }, [apiBase, docs]);

  useEffect(() => {
    indexDocs();
  }, [indexDocs]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleAsk = useCallback(async () => {
    const question = input.trim();
    if (!question || loading || indexing) return;

    setMessages((prev) => [...prev, createMessage('user', question)]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${apiBase}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        createMessage('assistant', data.answer ?? 'No response available.', data.source),
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        createMessage('assistant', `Error: ${error.message}`, { type: 'error' }),
      ]);
    } finally {
      setLoading(false);
    }
  }, [apiBase, indexing, input, loading]);

  const addDoc = useCallback(() => {
    if (!docName.trim() || !docContent.trim()) return;
    setDocs((prev) => [...prev, { id: Date.now(), name: docName.trim(), content: docContent.trim() }]);
    setDocName('');
    setDocContent('');
  }, [docContent, docName]);

  const removeDoc = useCallback((id) => {
    setDocs((prev) => prev.filter((doc) => doc.id !== id));
  }, []);

  return (
    <main className="mx-auto max-w-5xl p-4 md:p-6">
      <h1 className="text-2xl font-semibold text-slate-800">Hybrid RAG Agent</h1>
      <p className="mt-1 text-sm text-slate-600">Local document retrieval with Claude fallback.</p>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-lg font-medium">Document management</h2>
          <input
            className="mb-2 w-full rounded border p-2 text-sm"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            placeholder="Document name"
          />
          <textarea
            className="mb-2 h-24 w-full rounded border p-2 text-sm"
            value={docContent}
            onChange={(e) => setDocContent(e.target.value)}
            placeholder="Document content"
          />
          <button className="rounded bg-slate-900 px-3 py-2 text-sm text-white" onClick={addDoc} type="button">
            Add document
          </button>
          <ul className="mt-3 space-y-1 text-sm">
            {docs.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between rounded border px-2 py-1">
                <span className="truncate pr-2">{doc.name}</span>
                <button className="text-red-600" onClick={() => removeDoc(doc.id)} type="button">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-lg font-medium">Chat</h2>
          <div className="h-72 overflow-y-auto rounded border bg-slate-50 p-2">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {loading ? <p className="text-xs text-slate-500">Thinking...</p> : null}
            <div ref={bottomRef} />
          </div>
          <textarea
            className="mt-2 h-20 w-full rounded border p-2 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
            placeholder="Ask a question"
          />
          <button
            className="mt-2 rounded bg-blue-600 px-3 py-2 text-sm text-white disabled:opacity-50"
            disabled={loading || indexing}
            onClick={handleAsk}
            type="button"
          >
            {indexing ? 'Indexing…' : 'Send'}
          </button>
        </div>
      </section>
    </main>
  );
}
