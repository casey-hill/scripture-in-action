import { expect, test } from '@playwright/test'

test('navigation, browser history, theme and unknown screens', async ({ page }) => {
  await page.goto('./?scoutTheme=light')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("Today's journey")
  await page.getByRole('link', { name: 'Challenge', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  await expect(page.getByRole('link', { name: 'Challenge', exact: true })).toHaveAttribute('aria-current', 'page')
  await page.getByRole('link', { name: 'Progress', exact: true }).click()
  await expect(page.getByText('There is no learning history yet.', { exact: false })).toBeVisible()
  await page.goBack()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Listen before reacting')
  await page.getByRole('button', { name: 'Switch to dark theme' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.goto('./#unknown')
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
})

test('skip link and tablet/phone layouts', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeAttached()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
  for (const [width, height] of [[1280, 800], [800, 1280], [375, 812], [320, 640]]) {
    await page.setViewportSize({ width, height })
    const layout = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflow: [...document.querySelectorAll('body *')]
        .filter((element) => element.getBoundingClientRect().right > innerWidth)
        .map((element) => `${element.tagName}.${element.className}`),
    }))
    expect(layout.scrollWidth, JSON.stringify(layout)).toBeLessThanOrEqual(width)
    for (const link of await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link').all()) {
      const box = await link.boundingBox()
      expect(box?.height).toBeGreaterThanOrEqual(44)
    }
  }
})

test('repository-scoped manifest, icons and offline reload', async ({ page, context }) => {
  await page.goto('./')
  const manifestUrl = await page.locator('link[rel="manifest"]').getAttribute('href')
  expect(manifestUrl).toBeTruthy()
  const response = await page.request.get(manifestUrl!)
  const manifest = await response.json()
  expect(manifest.display).toBe('standalone')
  expect(manifest.start_url).toBe('./')
  expect(manifest.scope).toBe('./')
  for (const icon of manifest.icons) {
    const iconResponse = await page.request.get(new URL(icon.src, page.url()).href)
    expect(iconResponse.ok()).toBe(true)
    expect(iconResponse.headers()['content-type']).toContain('image/png')
  }
  await expect(page.getByRole('status', { name: 'App status' })).toContainText('App shell and lessons ready for offline use', { timeout: 20000 })
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await page.reload()
  await page.waitForFunction(() => !!navigator.serviceWorker.controller)
  const scope = await page.evaluate(async () => (await navigator.serviceWorker.ready).scope)
  expect(scope).toBe('http://127.0.0.1:4173/scripture-in-action/')
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("Today's journey")
  await expect(page.getByRole('status', { name: 'App status' })).toContainText('Offline')
  await page.getByRole('link', { name: 'Challenge', exact: true }).click()
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Listen before reacting')
})
