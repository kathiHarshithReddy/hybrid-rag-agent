```markdown
# hybrid-rag-agent Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns used in the `hybrid-rag-agent` JavaScript codebase, which is structured with Vite as the build tool. You'll learn about file naming, import/export conventions, and how to write and run tests using `vitest`. This guide also provides suggested commands to streamline your workflow.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `myComponent.js`, `dataFetcher.js`

### Import Style
- Use **relative imports** for modules.
  - Example:
    ```js
    import helper from './helper.js';
    import config from '../config/settings.js';
    ```

### Export Style
- Use a **mixed export style**: both default and named exports are present.
  - Example:
    ```js
    // Default export
    export default function fetchData() { ... }

    // Named export
    export function processData() { ... }
    ```

### Commit Patterns
- Commit messages are **freeform** (no strict type or scope), sometimes with prefixes.
- Average commit message length: ~25 characters.
  - Example:  
    ```
    Add new data fetcher
    Fix bug in agent logic
    ```

## Workflows

_No automated workflows detected in this repository._

## Testing Patterns

- **Testing Framework:** [`vitest`](https://vitest.dev/)
- **Test File Pattern:** Files ending with `.test.js`
  - Example: `agentLogic.test.js`
- **Writing Tests:**
  - Place test files alongside the code or in a dedicated test directory.
  - Example test:
    ```js
    import { processData } from './processData.js';
    import { describe, it, expect } from 'vitest';

    describe('processData', () => {
      it('should process input correctly', () => {
        expect(processData('input')).toBe('expectedOutput');
      });
    });
    ```

- **Running Tests:**
  - Use the `vitest` CLI to run all tests:
    ```
    npx vitest
    ```

## Commands

| Command       | Purpose                       |
|---------------|------------------------------|
| /run-tests    | Run all vitest test suites   |
| /build        | Build the project with Vite  |
| /dev          | Start Vite development server|

```