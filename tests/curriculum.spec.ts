import { expect, test } from '@playwright/test'
import { curriculum, getLesson, getPassage, getTranslation } from '../src/content/curriculum'

const approved = [
  ['Listen before reacting', 'James 1:19'],
  ['Ask for wisdom', 'James 1:5'],
  ['Hear before judging', 'Proverbs 18:13'],
  ['Respond gently', 'Proverbs 15:1'],
  ['Tell the truth', 'Proverbs 12:22'],
  ['Seek wise counsel', 'Proverbs 15:22'],
  ['Review and reflect', 'Review days 1-6'],
]

test('versioned curriculum matches the approved journey and has complete, consistent content', () => {
  expect(curriculum.schemaVersion).toBe(1)
  expect(curriculum.contentVersion).toMatch(/^\d+\.\d+\.\d+$/)
  expect(curriculum.journeys).toHaveLength(1)
  expect(curriculum.lessons).toHaveLength(7)
  expect(curriculum.passages).toHaveLength(6)
  for (const items of [curriculum.journeys, curriculum.lessons, curriculum.passages, curriculum.translations]) {
    const ids = items.map((item) => item.id)
    expect(new Set(ids).size).toBe(items.length)
    for (const id of ids) expect(id).toMatch(/^[a-zA-Z0-9-]+$/)
  }
  const journey = curriculum.journeys[0]
  expect(journey.lessons.map((entry) => entry.day)).toEqual([1, 2, 3, 4, 5, 6, 7])
  expect(new Set(journey.lessons.map((entry) => entry.lessonId)).size).toBe(7)
  for (const [index, entry] of journey.lessons.entries()) {
    const lesson = getLesson(entry.lessonId)
    expect(lesson.title).toBe(approved[index][0])
    expect(lesson.theme).toBe(approved[index][0])
    expect(lesson.translationId).toBe('NIV')
    expect(getTranslation(lesson.translationId).name).toBe('New International Version')
    const references = lesson.passageIds.map((id) => getPassage(id).reference)
    expect(new Set(lesson.passageIds).size).toBe(lesson.passageIds.length)
    if (index < 6) {
      expect(references).toEqual([approved[index][1]])
      expect(lesson.kind).toBe('practice')
      expect(lesson.reviewOfLessonIds).toEqual([])
    } else {
      expect(lesson.kind).toBe('review')
      expect(references).toEqual(approved.slice(0, 6).map((item) => item[1]))
      expect(lesson.reviewOfLessonIds).toEqual(journey.lessons.slice(0, 6).map((item) => item.lessonId))
    }
    for (const text of [lesson.contextNote, lesson.scenario, lesson.takeaway, lesson.reflectionPrompt]) {
      expect(text.trim().length).toBeGreaterThan(30)
    }
    expect(lesson.choices.length).toBeGreaterThanOrEqual(2)
    expect(lesson.choices.length).toBeLessThanOrEqual(4)
    expect(new Set(lesson.choices.map((choice) => choice.id)).size).toBe(lesson.choices.length)
    for (const choice of lesson.choices) {
      expect(choice.label.trim().length).toBeGreaterThan(20)
      expect(choice.feedback.trim().length).toBeGreaterThan(60)
      expect(choice).not.toHaveProperty('score')
      expect(choice).not.toHaveProperty('correct')
    }
  }
})

test('NIV records link to the exact passage and context, with no embedded text or claimed license', () => {
  const contexts = ['James 1:19-27', 'James 1:2-8', 'Proverbs 18:13-17', 'Proverbs 15:1-4', 'Proverbs 12:17-22', 'Proverbs 15:20-23']
  for (const [index, passage] of curriculum.passages.entries()) {
    expect(passage.reference).toBe(approved[index][1])
    expect(passage.contextReference).toBe(contexts[index])
    expect(passage.readings).toHaveLength(1)
    for (const reading of passage.readings) {
      expect(reading.translationId).toBe('NIV')
      expect(reading.kind).toBe('external-link')
      expect(Object.keys(reading).sort()).toEqual(['contextUrl', 'kind', 'translationId', 'url'])
      for (const [link, reference] of [[reading.url, passage.reference], [reading.contextUrl, passage.contextReference]]) {
        const url = new URL(link)
        expect(url.origin).toBe('https://www.biblegateway.com')
        expect(url.pathname).toBe('/passage/')
        expect(url.searchParams.get('search')).toBe(reference)
        expect(url.searchParams.get('version')).toBe('NIV')
      }
    }
  }
  expect(curriculum.translations[0].rightsNotice).toContain('no NIV Bible text is bundled')
  expect(curriculum.translations[0].rightsNotice).not.toContain('Used by permission')
})
