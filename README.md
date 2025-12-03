# SHACL Form Editor

Build validation schemas visually

## Requirements

- **Node.js**: `^20.19.0` or `>=22.12.0`
- **pnpm**: Package manager (install via `npm install -g pnpm`)

## Recommended VSCode Extensions

- [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Required for Vue 3 support

## How to Run

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Start the development server:

   ```sh
   cd app/web
   pnpm dev
   ```

3. Open your browser and navigate to http://localhost:5173/file/MyShaclFile/

Current capabilities:

1. Add/Remove node and property shapes, using the editor bar
2. Set basic information for shapes, using shape bar
3. Add/Remove text field, using toolbox and set basic information, such as path, name and description
4. Preview ttl in dialog, export to console log or file, see `src/views/editor-view.vue#L100`

For now IRI should be full, e.g.: http://example.com/MyNode, in the furture there will be a prefix manager, so you can type ex:MyNode

## Additional Information

For more detailed setup instructions see [app/web/README.md](app/web/README.md).
