# SHACL Form Editor

Build validation schemas visually

## Missing features

The tool is missing the following features:

- SHACL Logical Constraint Components: sh:not, sh:and, sh:or, sh:xone
- The Form mode to show the user how the shacl data will be transformed in to a form

## Documentation

See [Getting Started](docs/getting-started.md)

## Requirements

- **Node.js**: `^20.19.0` or `>=22.12.0`
- **pnpm**: Package manager (install via `npm install -g pnpm`)

## How to Run From Standalone

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Build server:

   ```sh
   cd apps/web
   pnpm build
   ```

3. Start server:

   ```sh
   pnpm preview
   ```

4. Open your browser and navigate to http://localhost:4173/

## Development

### Recommended VSCode Extensions

- [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Required for Vue 3 support

### How to Run From Editor

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Start the development server:

   ```sh
   cd apps/web
   pnpm dev
   ```

3. Open your browser and navigate to http://localhost:5173/

## Additional Information

For more detailed setup instructions see [app/webs/README.md](app/webs/README.md).
