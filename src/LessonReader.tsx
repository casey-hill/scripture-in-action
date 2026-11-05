import { useState } from 'react'
import { getPassage, getTranslation, lessonHref, passageSummary } from './content/curriculum'
import type { Journey, Lesson } from './content/model'

export default function LessonReader({ journey, lesson }: { journey: Journey; lesson: Lesson }) {
  const [selectedId, setSelectedId] = useState<string>()
  const selectedChoice = lesson.choices.find((choice) => choice.id === selectedId)
  const translation = getTranslation(lesson.translationId)
  const index = journey.lessons.findIndex((entry) => entry.lessonId === lesson.id)
  const entry = journey.lessons[index]
  const previous = journey.lessons[index - 1]
  const next = journey.lessons[index + 1]

  return (
    <>
      <div className="page-intro">
        <p className="eyebrow">{journey.title} / Day {entry.day} of {journey.lessons.length}</p>
        <h1 tabIndex={-1}>{lesson.title}</h1>
        <p>{passageSummary(lesson)} <span className="badge">{translation.id}</span></p>
        <p className="caption">Choose any response to explore its implications. No score, completion, or saved progress.</p>
      </div>
      <section className="card lesson-section" aria-labelledby="scenario-title">
        <p className="eyebrow">Suggested application / original scenario</p>
        <h2 id="scenario-title">A moment to consider</h2>
        <p>{lesson.scenario}</p>
        <fieldset className="scenario-choices" aria-describedby="choice-note">
          <legend>What would you consider doing?</legend>
          <p id="choice-note" className="caption">Explore more than one response. Your choice stays only while this lesson is open; it is not saved.</p>
          {lesson.choices.map((choice) => (
            <label key={choice.id} className="scenario-choice">
              <input type="radio" name="scenario-response" value={choice.id} checked={selectedId === choice.id} onChange={() => setSelectedId(choice.id)} />
              <span>{choice.label}</span>
            </label>
          ))}
        </fieldset>
        <div role="status" aria-label="Response feedback" aria-atomic="true">
          {selectedChoice && <div className="notice feedback"><h3>Consider this</h3><p>{selectedChoice.feedback}</p><p className="caption">Teaching commentary, not a spiritual score.</p></div>}
        </div>
      </section>
      <section className="card lesson-section" aria-labelledby="scripture-title">
        <p className="eyebrow">Scripture is the authority; teaching notes are aids</p>
        <h2 id="scripture-title">Scripture in context</h2>
        <h3>Context note (original commentary)</h3>
        <p>{lesson.contextNote}</p>
        {lesson.passageIds.map((id) => {
          const passage = getPassage(id)
          const reading = passage.readings.find((item) => item.translationId === lesson.translationId)
          if (!reading) throw new Error(`Missing ${lesson.translationId} reading for ${passage.id}`)
          return (
            <article key={id} className="passage" aria-labelledby={`${id}-title`}>
              <h3 id={`${id}-title`}>{passage.reference} <span className="badge">{translation.id}</span></h3>
              {reading.kind === 'licensed-text' && <><blockquote>{reading.text}</blockquote><p className="caption">{reading.copyrightNotice}</p></>}
              <div className="reading-links">
                <a className="text-link" href={reading.url} target="_blank" rel="noopener noreferrer">Read in {translation.id}: {passage.reference} <span className="caption">(new tab)</span></a>
                <a className="text-link" href={reading.contextUrl} target="_blank" rel="noopener noreferrer">Read surrounding passage: {passage.contextReference} <span className="caption">(new tab)</span></a>
              </div>
            </article>
          )
        })}
        <div className="notice">
          <strong>{translation.name} ({translation.id}) reading information</strong>
          <p>{translation.rightsNotice}</p>
          <p>External readings require an internet connection and open on Bible Gateway, which has its own privacy and usage terms. The app does not download or cache those pages.</p>
          <a className="text-link" href={translation.rightsUrl} target="_blank" rel="noopener noreferrer">Translation and copyright information (new tab)</a>
        </div>
      </section>
      <section className="card lesson-section" aria-labelledby="reflection-title">
        <p className="eyebrow">Suggested application / not Bible text</p>
        <h2 id="reflection-title">Carry it into your day</h2>
        <h3>Practical takeaway</h3>
        <p>{lesson.takeaway}</p>
        <h3>Reflect for a moment</h3>
        <p>{lesson.reflectionPrompt}</p>
        <p className="caption">Reflect privately, aloud or in your own journal. This app does not collect or save your reflection.</p>
      </section>
      <nav className="lesson-navigation" aria-label="Lesson navigation">
        {previous && <a className="button secondary" href={lessonHref(journey.id, previous.lessonId)}>Back: Day {previous.day}</a>}
        <a className="button secondary" href="#home">Return to journey</a>
        {next && <a className="button primary" href={lessonHref(journey.id, next.lessonId)}>Next: Day {next.day}</a>}
      </nav>
    </>
  )
}
