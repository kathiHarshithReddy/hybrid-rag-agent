import HybridRAGAgent from './components/HybridRAGAgent';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <HybridRAGAgent />
    </ErrorBoundary>
  );
}
