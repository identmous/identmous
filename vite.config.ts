import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { resolve } from "path";

const persistPath = resolve(new URL(import.meta.url).pathname, "..", ".wrangler", "state", "v3");

export default defineConfig({
  plugins: [
    sveltekit({
      d1Databases: ["D1"],
      d1Persist: resolve(persistPath, "d1"),
      kvNamespaces: ["KV"],
      kvPersist: resolve(persistPath, "kv")
    }),
  ],
  build: {
    sourcemap: true,
    minify: true,
    cssMinify: true,
  },
});
