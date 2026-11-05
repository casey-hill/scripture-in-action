# Scripture in Action

Milestone B: a touchscreen-friendly React + TypeScript + Vite PWA with a
seven-day wisdom and discernment curriculum.
Home, Challenge, and Progress use hash navigation, so GitHub Pages needs no route rewrites.
The app has light/dark themes, keyboard focus management, large navigation targets,
responsive layouts, an installable manifest, and offline-cached original lessons.

Browse any day, consider an original scenario, select a response to explore thoughtful
feedback, then read the passage in context through labeled NIV links. Practical
takeaways and reflection prompts are included; reflections are not collected.
Choices last only while a lesson is open and reset when leaving it or reloading.
There is **no scoring, saved completion, mastery tracking, memorization game,
review scheduler, persistence, or backup/restore**. Progress remains a Milestone D preview.
No verbatim NIV Bible text is included in source or offline bundles.
No account, analytics, AI, external fonts, or cloud database is used.
The book illustration and app icons are original geometric artwork created for this project.

## Local development

Use Node.js 24 LTS (or a supported newer release) and npm.

```powershell
npm ci
npm run dev
```

Open the localhost URL printed by Vite. Service workers are enabled only in production
builds, not the development server.

```powershell
npm run lint
npx playwright install chromium
npm test
npm run build
npm run preview
```

The browser tests build a production version at `/scripture-in-action/` and start
their own preview server on port 4173. Stop any other server using that port first.
They cover curriculum integrity and reference mappings, every lesson and choice,
reading links, deep links/history, keyboard-only flows, ephemeral choices,
light/dark narrow/tablet layouts, touch targets, manifest/icons,
repository-scoped service worker registration, and offline lesson reloads.

## Structure

- `src/App.tsx`: shell, hash routing, Home outline, Progress preview, connection/cache/update notices.
- `src/LessonReader.tsx`: scenario choices/feedback, passage links, context, takeaways, reflection, back/next.
- `src/content/model.ts`: versioned content types, translation and passage-delivery contracts.
- `src/content/curriculum.ts`: seven lessons, six stable passages, translations, journeys, selectors.
- `src/index.css`: shared theme tokens and typography.
- `src/App.css`: responsive layout and component styles.
- `public/`: local app icons.
- `vite.config.ts`: configurable base path, manifest, and generated Workbox service worker.
- `tests/`: curriculum integrity and production browser coverage.
- `docs/CHANGELOG.md`, `docs/FEEDBACK.md`: changes and tablet-review feedback template.
- `.github/workflows/deploy.yml`: build and deploy to GitHub Pages.

## Curriculum architecture

The bundled curriculum has `schemaVersion: 1` and `contentVersion: 1.0.0`.
Lessons, passages, translations, and journeys each have stable IDs.
Day/order lives in each journey's lesson entries, so a lesson can be reused in
another journey without changing its identity. The schema accepts multiple journeys;
one ships now. Home and the reader both derive their content from this data.
Day 7 refers to all six earlier lessons and passage IDs, not an invented review verse.

| Day | Theme | NIV reference |
| --- | --- | --- |
| 1 | Listen before reacting | James 1:19 |
| 2 | Ask for wisdom | James 1:5 |
| 3 | Hear before judging | Proverbs 18:13 |
| 4 | Respond gently | Proverbs 15:1 |
| 5 | Tell the truth | Proverbs 12:22 |
| 6 | Seek wise counsel | Proverbs 15:22 |
| 7 | Review and reflect | Review days 1-6 |

Each lesson includes an original context note, scenario, three plausible responses
with individual feedback, practical takeaway, and reflection prompt. Context and
application are explicitly labeled as commentary, not Bible text. References and
themes match the approved brief; linked Scripture is provided for reader review.
The notes attend to James's wider argument and the character of Proverbs as wisdom,
not guaranteed outcomes. Listening and gentleness do not require tolerating harm.
This is not an independent pastoral endorsement; human editorial/theological
review of wording and scenarios remains advisable before wider teaching use.

Lesson URLs use `#challenge/<journey-id>/<lesson-id>`. `#challenge` opens the
first lesson; invalid journey/lesson combinations show a recoverable not-found page.
All days are available without calendar gates. No choice or visit marks a lesson
complete. Future private learning records must remain separate from bundled content
and reference its stable IDs and version rather than mutate the curriculum.

Passages carry translation-specific readings. Current readings are
`kind: 'external-link'`. A future `licensed-text` record requires text, its copyright
notice, a permission reference, and explicit offline-cache permission because the
PWA precaches bundled content. The reader already distinguishes those delivery
types. Adding another explicitly selected translation should add its own reading
and translation metadata; never relabel another translation as NIV.

## NIV rights and limitations

Decision recorded **2026-11-05: links only; NIV redistribution rights unresolved**.

- Attempted Biblica's [permissions page](https://www.biblica.com/permissions/)
  and [permissions FAQ](https://www.biblica.com/resources/bible-faqs/permissions/);
  both returned HTTP 403 to the research tool, so their current terms could not
  be verified directly.
- Reviewed Bible Gateway's [NIV copyright information](https://www.biblegateway.com/versions/New-International-Version-NIV-Bible/).
  It describes a quotation allowance of up to 500 verses, no complete Bible book,
  and less than 25% of the containing work, with prescribed attribution. It also
  contains personal-use/reposting restrictions. That is not a documented grant for
  this app's public source redistribution, offline caches, or future interactive
  memorization/scaling. We do not infer a license from verse count or attribution.
- No NIV Bible text is embedded, fetched, scraped, or cached by the application.
  Original explanations are never presented as NIV quotations. Bible Gateway
  passage/context links explicitly request `version=NIV`, open in a new tab without
  an opener or referrer, and require internet access. Bible Gateway applies its
  own privacy and usage terms.
- The reader identifies NIV/New International Version and Biblica's copyright
  ownership/trademarks without claiming "Used by permission." This app does not
  assert permission it has not obtained.

Offline verbatim NIV study and memorization remain blocked pending permission or
licensing covering the actual distribution and caching model. Before enabling
licensed text, verify the current rights-holder terms, territory, edition,
quotation/content limits, notices, public-source redistribution, offline caching,
interactive use, and any commercial/scaling restrictions; record the grant.
Alternatively, a separately chosen translation with suitable rights could be added
with accurate labeling. No translation substitution is made in this milestone.

## Personal GitHub / Pages

Public repository: `https://github.com/casey-hill/scripture-in-action`.
Public app: `https://casey-hill.github.io/scripture-in-action/`.
The owner approved public source and GitHub Pages publication.
No credentials are stored in this project.

The repository and workflow-based Pages site were created for Milestone A.
Local changes do not update the public site until pushed and successfully deployed.

1. Keep **Settings > Pages > Source** set to **GitHub Actions**.
2. Push reviewed changes to `main`, or run **Deploy to GitHub Pages** from Actions.
3. Open the deployment URL shown by the workflow (normally
   `https://casey-hill.github.io/scripture-in-action/`).

The workflow derives the base path from Pages configuration, supporting project
sites and custom domains. For a local repository-path preview:

```powershell
$env:BASE_PATH = '/scripture-in-action/'
npm run build
npm run preview
```

The default base is `/`. Hash links and manifest scope stay inside the configured
base. Hosting must use HTTPS (localhost is allowed for development).

## Windows tablet review checklist

- Open all seven days from Home, including Day 7 with its six reference links.
- Tap each scenario response and compare its explanation; there should be no score
  or completed-day indicator. Leave/reopen a lesson and confirm the choice resets.
- Use Back/Next, Return to journey, browser Back, and a copied lesson deep link.
- Use a keyboard: Tab to Skip to content, Enter, Tab to Begin the journey,
  then Tab/Space/arrow keys through choices. Check heading focus and announced feedback.
- Switch themes and rotate between portrait and landscape; confirm comfortable
  touch targets, readable wrapping, visible focus, and no horizontal scrolling.
- Online, open Read in NIV and the surrounding passage; confirm the correct
  passage and translation on Bible Gateway, then return to the original app tab.
- On the production build, wait for **App shell and lessons ready for offline use**,
  disconnect, and reload a deep-linked lesson. Original content and feedback should
  work; NIV links are explicitly online-only. An uncached first offline visit is unsupported.
- In Windows Edge, install from the address-bar install icon or Apps menu; launch
  the installed app and confirm its standalone window and offline shell.
- Open Progress and confirm that saved progress and backup remain clearly unimplemented.
- Record issues using `docs/FEEDBACK.md`; do not commit private journal content or screenshots.

Automated Chromium coverage does not replace physical Windows Edge tablet or
installation validation. Those remain manual checks. No physical Windows tablet
acceptance or independent accessibility audit is claimed.

## Milestone C recommendations (not implemented)

- Review teaching content and resolve translation licensing before designing
  verbatim-text exercises; keep an explicit online-only path if rights remain unresolved.
- Add the planned memorization/recall interactions and richer explanations without
  turning scenario responses into a score of spiritual maturity.
- Keep any future review scheduler separate from curriculum data and ground it in
  the later approved scheduling/persistence specification. Do not silently add saved
  completion, groups, or storage; persistent records and backup remain Milestone D.

The current PWA build-tool dependency tree reports six npm advisories (two low,
four moderate, including transitive counts) in Workbox's build dependencies.
These are not runtime dependencies shipped to users. No forced major-version
overrides have been applied; review upstream fixes before accepting untrusted
build input. The production dependency audit reports no advisories.

## Cache and privacy

Only static shell assets and original bundled curriculum content are cached.
No choices, learning history, reflections, or theme preference are persisted.
NIV reading pages are never part of the service-worker cache.
The initial theme follows the OS (or `?scoutTheme=light` / `dark` for previews);
the toggle lasts for the current page session. New app versions display an
**Update and reload** action rather than unexpectedly replacing an open session.
Use browser site settings to clear installed/cached app data. Other sites on the
same GitHub Pages origin share browser-origin storage, so this is not yet a
security boundary for sensitive reflections.
