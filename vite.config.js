import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa"; // 1. Import the plugin

// https://vite.dev/config/
export default defineConfig({
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
        globPatterns: ["**/*.{js,css,html,ico,png,svg,avif}"],
      },
    }),
  ],
});
