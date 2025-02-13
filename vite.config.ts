import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { tempo } from "tempo-devtools/dist/vite";
import fs from "fs";

const conditionalPlugins: [string, Record<string, any>][] = [];

// @ts-ignore
if (process.env.TEMPO === "true") {
  conditionalPlugins.push(["tempo-devtools/swc", {}]);
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "./preview.html",
    },
    write: true,
  },
  plugins: [
    react({
      plugins: conditionalPlugins,
    }),
    tempo(),
    {
      name: "rename-preview-to-index",
      closeBundle() {
        const distPath = path.resolve("dist", "preview.html");
        const indexPath = path.resolve("dist", "index.html");
        if (fs.existsSync(distPath)) {
          fs.renameSync(distPath, indexPath);
        }
      },
    },
  ],
  resolve: {
    preserveSymlinks: true,
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // @ts-ignore
    allowedHosts: true,
    fs: {
      allow: ["."],
    },
  },
  publicDir: "content",
});
