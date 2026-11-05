import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://127.0.0.1:4173/scripture-in-action/',
    viewport: { width: 1024, height: 768 },
  },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    env: { BASE_PATH: '/scripture-in-action/' },
    url: 'http://127.0.0.1:4173/scripture-in-action/',
    reuseExistingServer: false,
  },
})
