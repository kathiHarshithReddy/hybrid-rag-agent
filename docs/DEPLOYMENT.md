# Deployment Guide

## Vercel
1. Set `VERCEL_TOKEN` in repository secrets for GitHub Actions deployment.
2. Set runtime env vars: `ANTHROPIC_API_KEY`, `INTERNAL_API_KEY`, `PORT`.
3. Push to `main` to trigger `.github/workflows/deploy.yml`.

## Netlify
1. Connect repository and use `netlify.toml` build settings.
2. Configure equivalent environment variables.
