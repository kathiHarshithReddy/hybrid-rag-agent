/**
 * Retry helper with exponential backoff.
 * @template T
 * @param {() => Promise<T>} operation
 * @param {{ retries?: number, baseDelayMs?: number }} options
 * @returns {Promise<T>}
 */
export async function withRetry(operation, options = {}) {
  const retries = options.retries ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 300;

  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      const backoff = baseDelayMs * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, backoff));
    }
  }

  throw lastError;
}
