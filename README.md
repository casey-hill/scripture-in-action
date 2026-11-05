# Scripture in Action

Milestone A: a touchscreen-friendly React + TypeScript + Vite PWA scaffold.
Home, Challenge, and Progress use hash navigation, so GitHub Pages needs no route rewrites.
The app has light/dark themes, keyboard focus management, large navigation targets,
responsive layouts, an installable manifest, and an offline-cached app shell.

Lessons, Scripture text, scoring, reflections, review scheduling, persistence, and
backup/restore are deliberately **not implemented**. Screens label these boundaries.
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
They cover navigation/history, focus, theme switching, narrow/tablet layouts,
manifest/icons, repository-scoped service worker registration, and offline reload.

## Structure

- `src/App.tsx`: shell, navigation, connection/cache/update notices, three preview screens.
- `src/index.css`: shared theme tokens and typography.
- `src/App.css`: responsive layout and component styles.
- `public/`: local app icons.
- `vite.config.ts`: configurable base path, manifest, and generated Workbox service worker.
- `tests/`: production browser smoke tests.
- `.github/workflows/deploy.yml`: build and deploy to GitHub Pages.

No lesson schema is invented in A; reviewed content and typed schemas belong to B.
Future user progress must remain separate from versioned bundled content.

## Personal GitHub / Pages

Public repository: `https://github.com/casey-hill/scripture-in-action`.
Public app: `https://casey-hill.github.io/scripture-in-action/`.
The owner approved public source and GitHub Pages publication.
No credentials are stored in this project.

1. Create the approved repository under `casey-hill` and push this project to `main`.
2. In repository **Settings > Pages**, choose **GitHub Actions** as the source.
3. Run **Deploy to GitHub Pages** from Actions, or push a change to `main`.
4. Open the deployment URL shown by the workflow (normally
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

## Demo checklist

- Open Home, Challenge, and Progress; try browser Back and keyboard-only navigation.
- Switch themes and resize between portrait, landscape, and phone widths.
- On the production build, wait for **App shell ready for offline use**, disconnect,
  and reload each screen. Initial offline access without a cached visit is not supported.
- In Windows Edge, install from the address-bar install icon or Apps menu; launch
  the installed app and confirm its standalone window and offline shell.
- Confirm previews do not imply working lessons, saved progress, or backup support.

Automated Chromium coverage does not replace physical Windows Edge tablet or
installation validation. Those remain manual checks. Offline lessons and complete
quality acceptance belong to later milestones.

The current PWA build-tool dependency tree reports six npm advisories (two low,
four moderate, including transitive counts) in Workbox's build dependencies.
These are not runtime dependencies shipped to users. No forced major-version
overrides have been applied; review upstream fixes before accepting untrusted
build input. The production dependency audit reports no advisories.

## Cache and privacy

Only static shell assets are cached. No learning data or theme preference is persisted.
The initial theme follows the OS (or `?scoutTheme=light` / `dark` for previews);
the toggle lasts for the current page session. New app versions display an
**Update and reload** action rather than unexpectedly replacing an open session.
Use browser site settings to clear installed/cached app data. Other sites on the
same GitHub Pages origin share browser-origin storage, so this is not yet a
security boundary for sensitive reflections.
