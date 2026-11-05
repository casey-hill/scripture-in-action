export interface Translation {
  readonly id: string
  readonly name: string
  readonly rightsNotice: string
  readonly rightsUrl: string
}

export type PassageReading = {
  readonly translationId: string
  readonly url: string
  readonly contextUrl: string
} & (
  | { readonly kind: 'external-link' }
  | {
    readonly kind: 'licensed-text'
    readonly text: string
    readonly copyrightNotice: string
    readonly permissionReference: string
    // Bundled content is precached by the PWA, so display-only permission is insufficient.
    readonly offlineCachingPermitted: true
  }
)

export interface Passage {
  readonly id: string
  readonly reference: string
  readonly contextReference: string
  readonly readings: readonly PassageReading[]
}

export interface ScenarioChoice {
  readonly id: string
  readonly label: string
  readonly feedback: string
}

export interface Lesson {
  readonly id: string
  readonly title: string
  readonly theme: string
  readonly translationId: string
  readonly passageIds: readonly string[]
  readonly contextNote: string
  readonly scenario: string
  readonly choices: readonly ScenarioChoice[]
  readonly takeaway: string
  readonly reflectionPrompt: string
  readonly kind: 'practice' | 'review'
  readonly reviewOfLessonIds: readonly string[]
}

export interface Journey {
  readonly id: string
  readonly title: string
  readonly description: string
  // Order belongs to a journey, allowing the same lesson to appear in other journeys.
  readonly lessons: readonly { readonly day: number; readonly lessonId: string }[]
}

export interface Curriculum {
  readonly schemaVersion: 1
  readonly contentVersion: string
  readonly translations: readonly Translation[]
  readonly passages: readonly Passage[]
  readonly lessons: readonly Lesson[]
  readonly journeys: readonly Journey[]
}
