export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`my-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-lg px-3 py-2 ${isUser ? 'bg-blue-600 text-white' : 'bg-white text-slate-900 border'}`}>
        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        {message.meta?.type && !isUser ? (
          <p className="mt-1 text-xs text-slate-500">Source: {message.meta.type}</p>
        ) : null}
      </div>
    </div>
  );
}
