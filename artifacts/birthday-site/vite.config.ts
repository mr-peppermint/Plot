import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const isReplit = process.env.REPL_ID !== undefined;

export default defineConfig(async () => {
  const replitPlugins = isReplit
    ? [
        (await import("@replit/vite-plugin-runtime-error-modal")).default(),
        ...(process.env.NODE_ENV !== "production"
          ? [
              (await import("@replit/vite-plugin-cartographer")).cartographer({
                root: path.resolve(import.meta.dirname, ".."),
              }),
              (await import("@replit/vite-plugin-dev-banner")).devBanner(),
            ]
          : []),
      ]
    : [];

  return {
    base: process.env.BASE_PATH ?? "/Plot/",
    plugins: [react(), tailwindcss(), ...replitPlugins],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
        "@assets": path.resolve(
          import.meta.dirname,
          "..",
          "..",
          "attached_assets"
        ),
      },
      dedupe: ["react", "react-dom"],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      port: Number(process.env.PORT ?? 5173),
      strictPort: false,
      host: "0.0.0.0",
      allowedHosts: true,
    },
    preview: {
      port: Number(process.env.PORT ?? 4173),
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});
