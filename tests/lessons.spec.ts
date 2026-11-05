import { expect, test } from '@playwright/test'
import { curriculum, getLesson, getPassage, lessonHref } from '../src/content/curriculum'

const journey = curriculum.journeys[0]

test('all seven days open from Home, show content and every response reveals its own feedback', async ({ page }) => {
  await page.goto('./')
  const outline = page.getByRole('list', { name: journey.title })
  await expect(outline.getByRole('listitem')).toHaveCount(7)
  for (const { day, lessonId } of journey.lessons) {
    const lesson = getLesson(lessonId)
    await outline.getByRole('link', { name: `Day ${day} ${lesson.title}`, exact: false }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(lesson.title)
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
    await expect(page).toHaveTitle(`${lesson.title} | Scripture in Action`)
    await expect(page.getByRole('link', { name: 'Challenge', exact: true })).toHaveAttribute('aria-current', 'page')
    await expect(page.getByText(lesson.scenario, { exact: true })).toBeVisible()
    await expect(page.getByText(lesson.contextNote, { exact: true })).toBeVisible()
    await expect(page.getByText(lesson.takeaway, { exact: true })).toBeVisible()
    await expect(page.getByText(lesson.reflectionPrompt, { exact: true })).toBeVisible()
    const feedback = page.getByRole('status', { name: 'Response feedback' })
    await expect(feedback).toBeEmpty()
    for (const choice of lesson.choices) {
      await page.getByRole('radio', { name: choice.label, exact: true }).check()
      await expect(feedback).toContainText(choice.feedback)
      await expect(feedback).toContainText('not a spiritual score')
      await expect(page.getByRole('radio', { checked: true })).toHaveCount(1)
    }
    for (const id of lesson.passageIds) {
      const passage = getPassage(id)
      const reading = passage.readings[0]
      const link = page.getByRole('link', { name: `Read in NIV: ${passage.reference} (new tab)`, exact: true })
      await expect(link).toHaveAttribute('href', reading.url)
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      await expect(page.getByRole('link', { name: `Read surrounding passage: ${passage.contextReference} (new tab)`, exact: true })).toHaveAttribute('href', reading.contextUrl)
    }
    await expect(page.getByRole('blockquote')).toHaveCount(0)
    await expect(page.getByRole('textbox')).toHaveCount(0)
    await page.getByRole('link', { name: 'Return to journey', exact: true }).click()
  }
})

test('deep links, sequential navigation, browser history and invalid lesson routes', async ({ page }) => {
  const second = journey.lessons[1]
  await page.goto(`./${lessonHref(journey.id, second.lessonId)}`)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ask for wisdom')
  await page.getByRole('link', { name: 'Next: Day 3', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Hear before judging')
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused()
  await page.goBack()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ask for wisdom')
  await page.getByRole('link', { name: 'Back: Day 1', exact: true }).click()
  await expect(page.getByRole('link', { name: /^Back: Day/ })).toHaveCount(0)
  await page.goto(`./${lessonHref(journey.id, journey.lessons[6].lessonId)}`)
  await expect(page.getByText('Review days 1-6', { exact: false }).first()).toBeVisible()
  await expect(page.getByRole('link', { name: /^Read in NIV:/ })).toHaveCount(6)
  await expect(page.getByRole('link', { name: /^Next: Day/ })).toHaveCount(0)
  for (const route of [
    `#challenge/${journey.id}/does-not-exist`,
    `#challenge/unknown/${second.lessonId}`,
    '#challenge',
    '#challenge/%E0%A4%A/unknown',
    `#challenge/${journey.id}/${second.lessonId}/extra`,
  ]) {
    await page.goto(`./${route}`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(route === '#challenge' ? 'Listen before reacting' : 'Page not found')
  }
  await page.getByRole('link', { name: 'Go home', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("Today's journey")
})

test('choices reset on lesson changes and reload; Progress never claims saved learning', async ({ page }) => {
  await page.goto('./#challenge')
  await page.getByRole('radio').first().check()
  await page.getByRole('link', { name: 'Next: Day 2', exact: true }).click()
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0)
  await page.getByRole('link', { name: 'Back: Day 1', exact: true }).click()
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0)
  await page.getByRole('radio').last().check()
  await page.reload()
  await expect(page.getByRole('radio', { checked: true })).toHaveCount(0)
  await page.getByRole('link', { name: 'Progress', exact: true }).click()
  await expect(page.getByText('Coming in Milestone D', { exact: true })).toBeVisible()
  await expect(page.getByText('There is no learning history yet.', { exact: false })).toBeVisible()
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 })
  expect(await page.evaluate(async () => await indexedDB.databases())).toEqual([])
})

test('keyboard-only lesson choices, feedback, sequential navigation and return Home', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Begin the journey', exact: false })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Listen before reacting', exact: true })).toBeFocused()
  await page.keyboard.press('Tab')
  const radios = page.getByRole('radio')
  await expect(radios.first()).toBeFocused()
  await page.keyboard.press('Space')
  await expect(radios.first()).toBeChecked()
  await page.keyboard.press('ArrowDown')
  await expect(radios.nth(1)).toBeFocused()
  await expect(radios.nth(1)).toBeChecked()
  await expect(page.getByRole('status', { name: 'Response feedback' })).toContainText(getLesson(journey.lessons[0].lessonId).choices[1].feedback)
  // Traverse actual tab order, including reading links, without programmatic focus.
  for (let count = 0; count < 10 && !await page.getByRole('link', { name: 'Next: Day 2', exact: true }).evaluate((element) => element === document.activeElement); count++) {
    await page.keyboard.press('Tab')
  }
  await expect(page.getByRole('link', { name: 'Next: Day 2', exact: true })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Ask for wisdom', exact: true })).toBeFocused()
  for (let count = 0; count < 10 && !await page.getByRole('link', { name: 'Return to journey', exact: true }).evaluate((element) => element === document.activeElement); count++) {
    await page.keyboard.press('Tab')
  }
  await expect(page.getByRole('link', { name: 'Return to journey', exact: true })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("Today's journey")
})

test('lesson layouts and touch targets fit narrow phones and both tablet orientations in both themes', async ({ page }) => {
  await page.goto('./')
  for (const theme of ['light', 'dark']) {
    for (const [width, height] of [[1280, 800], [800, 1280], [375, 812], [320, 640]]) {
      await page.setViewportSize({ width, height })
      for (const hash of ['#home', lessonHref(journey.id, journey.lessons[0].lessonId), lessonHref(journey.id, journey.lessons[6].lessonId)]) {
        await page.goto(`./?scoutTheme=${theme}${hash}`)
        if (hash !== '#home') await page.getByRole('radio').last().check()
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width)
        const targets = page.locator('.lesson-outline a, .scenario-choice, .reading-links a, .lesson-navigation a')
        for (const target of await targets.all()) {
          expect((await target.boundingBox())?.height).toBeGreaterThanOrEqual(44)
        }
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
      }
    }
  }
})

test('all original lessons and feedback work after an offline deep-link reload without fetching NIV', async ({ page, context }) => {
  const externalRequests: string[] = []
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== 'http://127.0.0.1:4173') externalRequests.push(request.url())
  })
  await page.goto('./')
  await expect(page.getByRole('status', { name: 'App status' })).toContainText('App shell and lessons ready for offline use', { timeout: 20000 })
  await page.reload()
  await page.waitForFunction(() => !!navigator.serviceWorker.controller)
  await context.setOffline(true)
  for (const entry of journey.lessons) {
    const lesson = getLesson(entry.lessonId)
    await page.goto(`./${lessonHref(journey.id, lesson.id)}`)
    await page.reload()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(lesson.title)
    await page.getByRole('radio').first().check()
    await expect(page.getByRole('status', { name: 'Response feedback' })).toContainText(lesson.choices[0].feedback)
    await expect(page.getByRole('status', { name: 'App status' })).toContainText('Offline - cached shell and lessons available; NIV links need internet')
    await expect(page.getByText('External readings require an internet connection', { exact: false })).toBeVisible()
  }
  expect(externalRequests).toEqual([])
})
