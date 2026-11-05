import type { Curriculum, Passage } from './model'

function nivPassage(id: string, reference: string, contextReference: string): Passage {
  const link = (search: string) => `https://www.biblegateway.com/passage/?search=${encodeURIComponent(search)}&version=NIV`
  return {
    id, reference, contextReference,
    readings: [{ translationId: 'NIV', kind: 'external-link', url: link(reference), contextUrl: link(contextReference) }],
  }
}

export const curriculum: Curriculum = {
  schemaVersion: 1,
  contentVersion: '1.0.0',
  translations: [{
    id: 'NIV',
    name: 'New International Version',
    rightsNotice: 'NIV text is copyrighted by Biblica, Inc. New International Version and NIV are registered trademarks of Biblica, Inc. This app links to NIV readings; no NIV Bible text is bundled. Offline NIV text and memorization await permission or licensing.',
    rightsUrl: 'https://www.biblegateway.com/versions/New-International-Version-NIV-Bible/',
  }],
  passages: [
    nivPassage('james-1-19', 'James 1:19', 'James 1:19-27'),
    nivPassage('james-1-5', 'James 1:5', 'James 1:2-8'),
    nivPassage('proverbs-18-13', 'Proverbs 18:13', 'Proverbs 18:13-17'),
    nivPassage('proverbs-15-1', 'Proverbs 15:1', 'Proverbs 15:1-4'),
    nivPassage('proverbs-12-22', 'Proverbs 12:22', 'Proverbs 12:17-22'),
    nivPassage('proverbs-15-22', 'Proverbs 15:22', 'Proverbs 15:20-23'),
  ],
  lessons: [
    {
      id: 'listen-before-reacting',
      kind: 'practice',
      reviewOfLessonIds: [],
      title: 'Listen before reacting',
      theme: 'Listen before reacting',
      translationId: 'NIV',
      passageIds: ['james-1-19'],
      contextNote: 'James addresses a community learning to live out its faith. In 1:19-27, attention to others, restraint in anger, and putting the received word into practice belong together. Listening is not passive agreement or a command to stay in an unsafe conversation.',
      scenario: 'Someone close to you says you never make time for them. You remember several times you rearranged your plans, and you want to defend yourself immediately. The conversation is tense but not threatening. How might you begin?',
      choices: [
        {
          id: 'explain-first',
          label: 'Explain the times you changed your plans, so they have the full picture.',
          feedback: 'Your experience matters, and clarification may be needed. Starting with your defense, though, can leave their hurt unheard. First ask which recent moment felt lonely; then share your perspective without turning it into a contest.',
        },
        {
          id: 'ask-and-listen',
          label: 'Ask about the moment that hurt, and listen before describing your own experience.',
          feedback: 'A specific question makes room for understanding rather than an immediate rebuttal. Listening does not require accepting every accusation. After hearing them, reflect what you understood and explain your own needs with care.',
        },
        {
          id: 'take-a-pause',
          label: 'Ask for a short pause and agree on a time to return to the conversation.',
          feedback: 'A pause can help when anger is crowding out attention. Naming a return time keeps it from becoming avoidance. If you can listen calmly now, a pause may not be necessary; if the situation becomes unsafe, prioritize safety and support.',
        },
      ],
      takeaway: 'Make room for one honest question before you defend your position.',
      reflectionPrompt: 'In which relationship could you listen for the hurt beneath a complaint without abandoning your own boundaries?',
    },
    {
      id: 'ask-for-wisdom',
      kind: 'practice',
      reviewOfLessonIds: [],
      title: 'Ask for wisdom',
      theme: 'Ask for wisdom',
      translationId: 'NIV',
      passageIds: ['james-1-5'],
      contextNote: 'James 1:2-8 places the request for wisdom amid trials and the formation of perseverance. The invitation is to rely on God with an undivided allegiance, not to demand an instant prediction. Prayer is not a substitute for gathering facts, and feeling uncertain does not by itself establish a failure of faith.',
      scenario: 'You have two days to accept a job that pays more but changes your family routine. The employer has not answered questions about travel. You want to make a faithful decision, but the available information is incomplete.',
      choices: [
        {
          id: 'follow-relief',
          label: 'Accept because imagining the higher salary brings a sense of relief.',
          feedback: 'Financial relief is a real consideration, but a feeling alone cannot settle questions about responsibilities or travel. Bring both your hopes and your uncertainties into prayer, and seek the missing information before treating relief as divine confirmation.',
        },
        {
          id: 'pray-and-inquire',
          label: 'Ask God for wisdom, request travel details, and talk through the tradeoffs with those affected.',
          feedback: 'Prayer and careful inquiry can work together. Honest discussion helps you notice costs you might overlook. This does not guarantee a painless result or perfect certainty; it supports a responsible decision with the information you can obtain.',
        },
        {
          id: 'wait-for-certainty',
          label: 'Delay responding until you feel completely certain that one option is God\'s plan.',
          feedback: 'Taking time can prevent a rushed commitment. Yet complete certainty may not arrive before a real deadline. Ask for an extension if useful, name the unknowns, and seek wisdom for a responsible next step rather than requiring a special sign.',
        },
      ],
      takeaway: 'Ask God for wisdom while doing the patient work of understanding your options.',
      reflectionPrompt: 'What missing fact or unspoken responsibility should you bring into a decision you are praying about?',
    },
    {
      id: 'hear-before-judging',
      kind: 'practice',
      reviewOfLessonIds: [],
      title: 'Hear before judging',
      theme: 'Hear before judging',
      translationId: 'NIV',
      passageIds: ['proverbs-18-13'],
      contextNote: 'Proverbs 18:13 warns against giving an answer before hearing a matter. Nearby sayings also challenge confidence in a first account, especially 18:17. This wisdom encourages patient inquiry, not dismissal of someone reporting harm or a requirement to investigate danger alone.',
      scenario: 'A friend says a volunteer has been taking supplies home without permission. You have not seen it yourself. A group chat is asking whether the volunteer should be removed, and people expect you to weigh in.',
      choices: [
        {
          id: 'warn-group',
          label: 'Repeat the claim in the group chat as a precaution, making clear that you heard it secondhand.',
          feedback: 'Wanting to protect the group is understandable. Labeling a rumor as secondhand still spreads it and can damage someone before facts are established. Share concerns through a responsible, confidential channel rather than inviting a public verdict.',
        },
        {
          id: 'dismiss-claim',
          label: 'Say the volunteer is trustworthy and ask everyone to forget the allegation.',
          feedback: 'Resisting a rush to blame is valuable, but your confidence in a person is not evidence that nothing happened. Take the concern seriously without declaring guilt or innocence. An appropriate leader can hear the report and check the facts fairly.',
        },
        {
          id: 'seek-facts',
          label: 'Withhold a public verdict and ask the responsible leader to hear the concern and check what happened.',
          feedback: 'This protects both a serious concern and fair treatment. Keep the report limited to those who need to act. If the allegation involves immediate danger or safeguarding, use the appropriate urgent reporting route rather than waiting for informal consensus.',
        },
      ],
      takeaway: 'Separate what you know firsthand from what you have heard before offering a judgment.',
      reflectionPrompt: 'What question could help you understand a disputed account without spreading it?',
    },
    {
      id: 'respond-gently',
      kind: 'practice',
      reviewOfLessonIds: [],
      title: 'Respond gently',
      theme: 'Respond gently',
      translationId: 'NIV',
      passageIds: ['proverbs-15-1'],
      contextNote: 'Proverbs 15:1 contrasts the effects of gentle and harsh speech; the surrounding sayings attend to how words can help or harm. A proverb offers wisdom for conduct, not a guarantee of another person\'s reaction. Gentleness can be firm and does not require tolerating threats or abuse.',
      scenario: 'A teammate sends a sharp message blaming you for a missed deadline and copies several people. Part of the delay was yours, but an agreed dependency was also late. You need to correct the record without escalating the exchange.',
      choices: [
        {
          id: 'reply-in-kind',
          label: 'Reply to everyone with a detailed list of the teammate\'s mistakes.',
          feedback: 'A clear record matters, especially when blame is public. A list designed to embarrass, however, may turn clarification into retaliation. State the relevant facts and your own responsibility without using the audience as leverage.',
        },
        {
          id: 'calm-and-clear',
          label: 'Pause, acknowledge your part, and give a brief factual correction with a plan to resolve the delay.',
          feedback: 'Calm accuracy can reduce unnecessary friction while preserving accountability. You cannot ensure a gentle response from the other person. If public correction or a manager\'s help is needed, it can still be direct and respectful.',
        },
        {
          id: 'accept-all-blame',
          label: 'Accept all the blame so the disagreement ends quickly.',
          feedback: 'The desire for peace is understandable, but accepting an inaccurate account can hide problems and burden you unfairly. Gentleness is not self-erasure. Own what is yours, clarify what is not, and set limits if hostility continues.',
        },
      ],
      takeaway: 'Aim for a response that is both kind in tone and honest about the facts.',
      reflectionPrompt: 'What would a firm but non-retaliatory first sentence sound like in a difficult exchange?',
    },
    {
      id: 'tell-the-truth',
      kind: 'practice',
      reviewOfLessonIds: [],
      title: 'Tell the truth',
      theme: 'Tell the truth',
      translationId: 'NIV',
      passageIds: ['proverbs-12-22'],
      contextNote: 'Proverbs 12:17-22 repeatedly contrasts deceptive speech with reliable, healing speech. Verse 22 treats trustworthiness as a matter of relationship with God, not merely reputation management. Honesty does not promise immediate success, and it can respect legitimate confidentiality without misleading others.',
      scenario: 'Your team is preparing an update for a client. A colleague asks you to call a feature nearly finished, although a significant test has not passed. They say the wording will buy time and avoid unnecessary worry.',
      choices: [
        {
          id: 'use-optimistic-wording',
          label: 'Use the optimistic wording because the team still hopes to finish soon.',
          feedback: 'Hope about the outcome does not establish the present status. If the wording creates an impression you know is misleading, it can undermine the client\'s ability to plan. Distinguish the work completed from the test and timeline still uncertain.',
        },
        {
          id: 'expose-everything',
          label: 'Send the client the internal conversation to prove that you were not responsible for the wording.',
          feedback: 'Wanting distance from deception is understandable, but forwarding private discussion may breach trust or confidentiality without providing a useful update. Seek accurate approved wording, and use an appropriate escalation channel if pressure to mislead continues.',
        },
        {
          id: 'accurate-update',
          label: 'Propose an accurate update describing the remaining test and when a clearer estimate will be available.',
          feedback: 'A truthful update can name uncertainty without exaggerating either progress or failure. You may face an awkward conversation, and honesty does not guarantee that the client stays pleased. It does give them a more reliable basis for their decisions.',
        },
      ],
      takeaway: 'Describe what is known, what remains uncertain, and what you will do next without shaping a false impression.',
      reflectionPrompt: 'Where might technically accurate wording still give someone a misleading impression?',
    },
    {
      id: 'seek-wise-counsel',
      kind: 'practice',
      reviewOfLessonIds: [],
      title: 'Seek wise counsel',
      theme: 'Seek wise counsel',
      translationId: 'NIV',
      passageIds: ['proverbs-15-22'],
      contextNote: 'Proverbs 15:22 commends counsel in planning rather than isolated confidence. Its wisdom is not a promise that enough advisers will guarantee success. Seek people with relevant understanding, integrity, and room to disagree; popularity and the number of approving voices are not the same as wisdom.',
      scenario: 'A relative offers you a chance to invest a large share of your savings in a family business. They need a quick answer. You trust them, but the decision would affect your household\'s emergency funds and future plans.',
      choices: [
        {
          id: 'family-trust',
          label: 'Agree because consulting outsiders might suggest you do not trust your relative.',
          feedback: 'Family trust matters, but it does not remove financial risk or your responsibilities to others affected. Thoughtful questions and independent advice can protect a relationship by making expectations explicit before money changes hands.',
        },
        {
          id: 'independent-counsel',
          label: 'Ask for time to review the details with your household and a qualified adviser without a stake in the deal.',
          feedback: 'Relevant, independent counsel can expose assumptions and conflicts of interest. Hear the relative fairly too, and keep sensitive details limited to appropriate people. Advice supports your responsibility; it cannot remove risk or make the decision for you.',
        },
        {
          id: 'approval-poll',
          label: 'Ask several enthusiastic friends whether the investment sounds promising.',
          feedback: 'Friends can offer support and useful questions. If they lack the facts or feel unable to challenge you, agreement may reinforce your hopes rather than test them. Look for informed counsel that includes possible reasons not to proceed.',
        },
      ],
      takeaway: 'Invite informed disagreement before making a decision that others will have to live with.',
      reflectionPrompt: 'Who could give you relevant, independent advice, and what concern might you be reluctant to let them raise?',
    },
    {
      id: 'review-and-reflect',
      kind: 'review',
      reviewOfLessonIds: ['listen-before-reacting', 'ask-for-wisdom', 'hear-before-judging', 'respond-gently', 'tell-the-truth', 'seek-wise-counsel'],
      title: 'Review and reflect',
      theme: 'Review and reflect',
      translationId: 'NIV',
      passageIds: ['james-1-19', 'james-1-5', 'proverbs-18-13', 'proverbs-15-1', 'proverbs-12-22', 'proverbs-15-22'],
      contextNote: 'Return to the six passages in their own settings rather than blending them into a new Bible quotation. James connects dependence on God with lived faith; these Proverbs guide attentive, truthful speech and counsel. Together they help frame responsible action, but they do not supply a formula that guarantees a peaceful or profitable outcome.',
      scenario: 'At a family meeting, a sibling angrily claims another relative has mishandled money set aside for an older parent\'s care. No records have been shared. A payment is due soon, and someone asks you to publicly reassure everyone that all is well. You care about both relationships and the parent\'s immediate needs.',
      choices: [
        {
          id: 'reassure-without-records',
          label: 'Reassure everyone that the money is safe, then quietly check the details later.',
          feedback: 'Reducing panic is a worthy aim, but reassurance you cannot support can mislead people whose care decisions depend on the facts. Say what is known and unknown, attend to the payment deadline, and seek a reliable review without declaring a verdict.',
        },
        {
          id: 'public-accusation',
          label: 'Press the accused relative for an immediate public explanation before discussing the care payment.',
          feedback: 'Accountability matters, but public pressure based on an unverified claim may deepen conflict and leave an urgent need unmet. Listen carefully, seek records through an appropriate process, and separate immediate care arrangements from the investigation.',
        },
        {
          id: 'integrate-principles',
          label: 'Listen calmly, acknowledge the uncertainty, arrange help for the immediate need, and seek records and independent advice.',
          feedback: 'This brings several principles into conversation: listening without prejudging, truthful limits, a gentle tone, prayer for wisdom, and relevant counsel. It may still be difficult. If there are signs of exploitation or danger, use appropriate safeguarding or legal support rather than relying only on a family discussion.',
        },
      ],
      takeaway: 'Use the passages together to ask better questions, protect those affected, and choose one honest next step.',
      reflectionPrompt: 'Which of the six practices is hardest for you under pressure, and what small step could make room for it this week?',
    },
  ],
  journeys: [{
    id: 'wisdom-and-discernment',
    title: 'Seven days of wisdom and discernment',
    description: 'Listen, ask, discern, and respond with care. Open any day; these are invitations, not deadlines.',
    lessons: [
      { day: 1, lessonId: 'listen-before-reacting' },
      { day: 2, lessonId: 'ask-for-wisdom' },
      { day: 3, lessonId: 'hear-before-judging' },
      { day: 4, lessonId: 'respond-gently' },
      { day: 5, lessonId: 'tell-the-truth' },
      { day: 6, lessonId: 'seek-wise-counsel' },
      { day: 7, lessonId: 'review-and-reflect' },
    ],
  }],
}

export function getLesson(id: string) {
  const lesson = curriculum.lessons.find((item) => item.id === id)
  if (!lesson) throw new Error(`Unknown lesson: ${id}`)
  return lesson
}

export function getPassage(id: string) {
  const passage = curriculum.passages.find((item) => item.id === id)
  if (!passage) throw new Error(`Unknown passage: ${id}`)
  return passage
}

export function getTranslation(id: string) {
  const translation = curriculum.translations.find((item) => item.id === id)
  if (!translation) throw new Error(`Unknown translation: ${id}`)
  return translation
}

export function lessonHref(journeyId: string, lessonId: string) {
  return `#challenge/${encodeURIComponent(journeyId)}/${encodeURIComponent(lessonId)}`
}

export function passageSummary(lesson: { kind: 'practice' | 'review'; passageIds: readonly string[] }) {
  return lesson.kind === 'review' ? 'Review days 1-6' : lesson.passageIds.map((id) => getPassage(id).reference).join('; ')
}
