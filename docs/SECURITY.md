# Security Best Practices

- Keep `ANTHROPIC_API_KEY` and other secrets in environment variables.
- Never expose API keys in frontend bundles.
- Use optional `INTERNAL_API_KEY` to protect backend routes.
- Retry logic is bounded to avoid unbounded request loops.
- Helmet and CORS middleware are enabled by default.
