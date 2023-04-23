import { readFile, writeFile } from "node:fs/promises";

await writeFile(
  "node_modules/budoux/module/win-browser.js",
  (
    await readFile("node_modules/budoux/module/win-browser.js", "utf-8")
  ).replace("window", "globalThis")
);
