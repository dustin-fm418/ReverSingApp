# ReverSing! — Project State

_Last updated: 2026-08-15_ (post `fa86b3c` game-build push)

## Summary

The actual game is a single self-contained HTML file
([reversing-deploy/index.html](reversing-deploy/index.html), ~3.2MB, inline
JS/CSS/audio assets + [sw.js](reversing-deploy/sw.js) for offline/PWA
support). This is what's deployed to Netlify and what players use.

The repo also contains a **Nuxt 4 scaffold** (`app/`, `nuxt.config.ts`,
`dist/`) from the original `create-nuxt` starter. It is currently just the
default "Nuxt Minimal Starter" — `app/app.vue` still renders
`<NuxtWelcome />` — and is **not wired to the game**. It builds to `dist/`
but that output is not what Netlify serves.

## Deployment

- Netlify site publishes the **`reversing-deploy/`** directory directly
  (see [netlify.toml](netlify.toml): `publish = "reversing-deploy"`).
- The Nuxt build (`dist/`) is not the deploy target — it exists from
  scaffolding but isn't part of the live site.
- **Auto-deploy is wired up**: [.github/workflows/netlify-deploy.yml](.github/workflows/netlify-deploy.yml)
  runs on every push to `master`, checks out the repo, and deploys
  `reversing-deploy/` to Netlify via `nwtgck/actions-netlify`. No manual
  drag-and-drop into the Netlify dashboard is needed — committing and
  pushing a change to `reversing-deploy/index.html` is sufficient to ship it.
- Latest push (`fa86b3c`) updated `reversing-deploy/index.html` with a newer
  playtest build (429 insertions / 15 deletions vs. the prior v4 build from
  `0cb27cc`) and deployed via the workflow above.

## Git History

```
fa86b3c Update reversing-deploy game build with latest playtest changes
3515cd6 Merge pull request #1 from dustin-fm418/claude/github-netlify-auto-deploy-wuhzc8
6d04bb0 Add GitHub Actions workflow to auto-deploy to Netlify
0cb27cc Publish reversing-deploy as the Netlify site, update game to v4 playtest build
b98a13e Initial commit: Nuxt app with Netlify build config
```

Five commits total; branch `master`.

## What's implemented (in reversing-deploy/index.html)

- Full round loop: play reversed clip → record mimicry → play mimicry
  reversed → guess → reveal → score.
- 2–4 team management, live scoreboard with manual score adjust.
- Round timer (30–90s) and points-to-win, both configurable.
- Voice clip recording, file upload, difficulty tagging (Easy / Medium /
  Difficult / Insane), clip export/import as JSON packages.
- Sound pack toggling and category (difficulty) filtering for the active
  clip pool, with shuffle-bag draw logic to avoid repeats.
- Per-tab contextual help modals (Play / Score / Record / Settings), shown
  automatically on first visit to each tab.
- Game history logging.
- Dark/light theme toggle.
- Full local persistence via `localStorage`; "Reset for New Game" vs.
  destructive "Reset All Data".
- PWA install support via service worker.

See [spec.md](spec.md) for full gameplay rules and design details.

## Known gaps / open items

- **Nuxt scaffold is dead weight** — no decision yet on whether to migrate
  the standalone game into the Nuxt app, keep them as two separate things,
  or strip the unused Nuxt scaffold out entirely.
- `README.md` still has the default Nuxt starter content, not
  project-specific instructions.
- `docs/` exists but is empty.
- No automated tests for the game logic (single monolithic HTML/JS file).
- `.netlify/` (local Netlify CLI state) is present but untracked —
  confirm `.gitignore` covers it before committing.
- No CHANGELOG tracking what changed between playtest builds (currently
  "v4" per the latest commit message, but that version isn't labeled
  anywhere in-app or in a dedicated file).

## Tech stack

- Game itself: vanilla HTML/CSS/JS, Web Audio API, `localStorage`, service
  worker — no framework, no build step.
- Scaffold (unused by the live site): Nuxt 4, Vue 3, `@nuxtjs/tailwindcss`.
- Hosting: Netlify, static publish of `reversing-deploy/`.
