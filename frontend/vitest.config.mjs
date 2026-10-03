import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // O App Router usa JSX dentro de arquivos .js (app/page.js)
  plugins: [react({ include: /\.(js|jsx)$/ })],
  esbuild: { loader: "jsx", include: /\.(js|jsx)$/, exclude: [] },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.js"],
    exclude: ["node_modules/**", ".next/**", "out/**"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
