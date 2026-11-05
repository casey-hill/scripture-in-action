import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icon-192.png', 'icon-512.png', 'favicon.svg'],
      manifest: {
        id: './',
        name: 'Scripture in Action',
        short_name: 'Scripture',
        description: 'A quiet space for Scripture, wisdom, and everyday practice.',
        start_url: './',
        scope: './',
        display: 'standalone',
        background_color: '#f7f4ef',
        theme_color: '#b11f4b',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,webmanifest}'],
        navigateFallbackDenylist: [/\/api\//],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})
