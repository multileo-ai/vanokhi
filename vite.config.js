import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa"; // 1. Import the plugin

// https://vite.dev/config/
export default defineConfig({
  server: {
    headers: {
      // Allow Google login popup to communicate back to the opener window
      "Cross-Origin-Opener-Policy": "unsafe-none",
      "Cross-Origin-Embedder-Policy": "unsafe-none",
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Automatically updates the app when you push code
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "Vanokhi",
        short_name: "Vanokhi",
        description:
          "Crafted with passion. Luxury essentials for your wardrobe.",
        theme_color: "#860204",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "logobg192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logobg512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "logobg512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable", // Required for Android icon shapes
          },
        ],
        screenshots: [
          {
            src: "screenshot-desktop.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
            label: "Vanokhi Desktop View",
          },
          {
            src: "screenshot-mobile.png",
            sizes: "750x1334",
            type: "image/png",
            form_factor: "narrow",
            label: "Vanokhi Mobile View",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,svg}"], // Only cache essential assets
        globIgnores: ["**/node_modules/**/*", "sw.js", "workbox-*.js", "**/*.{png,jpg,jpeg,avif,webp}"], // Explicitly ignore heavy images
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB limit per file
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Splitting heavy node_modules into separate vendor chunks
          if (id.includes("node_modules")) {
            if (id.includes("firebase")) return "firebase";
            if (id.includes("framer-motion")) return "framer-motion";
            if (id.includes("gsap")) return "gsap";
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
