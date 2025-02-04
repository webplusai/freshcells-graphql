/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: false,
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    coverage: {
      include: ["src"],
      exclude: ["src/main.tsx"],
    },
  },
});
