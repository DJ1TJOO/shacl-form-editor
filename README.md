# SHACL Form Editor

Build validation schemas visually

## Requirements

- **Node.js**: `^20.19.0` or `>=22.12.0`
- **pnpm**: Package manager (install via `npm install -g pnpm`)

## Recommended VSCode Extensions

- [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Required for Vue 3 support

## How to Run From Editor

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Start the development server:

   ```sh
   cd app/web
   pnpm dev
   ```

3. Open your browser and navigate to http://localhost:5173/

## How to Run From Standalone

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Build server:

   ```sh
   cd app/web
   pnpm build
   ```

3. Start server:

   ```sh
   pnpm preview
   ```

4. Open your browser and navigate to http://localhost:4173/

## Additional Information

For more detailed setup instructions see [app/web/README.md](app/web/README.md).
