# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Start here

Read this file (CLAUDE.md) first, at the start of every session, before
doing anything else in this repo. Then, before making **any** change —
including small fixes — read [spec.md](spec.md) and [state.md](state.md)
in full:

- [spec.md](spec.md) is the source of truth for how the game is *supposed*
  to behave (rules, scoring, settings, data model). Don't guess gameplay
  behavior from code alone — confirm it against spec.md first.
- [state.md](state.md) tracks current build/deploy status and known gaps.
  Check it before assuming something is finished, broken, or unowned —
  it may already be a documented, intentional gap.

If a change ends up altering gameplay rules, settings, or deploy/build
status, update spec.md and/or state.md to match before finishing the task.

## Repository structure — two unrelated things live here

This repo contains **two separate codebases that do not depend on each
other**. Figure out which one a task actually touches before editing:

1. **The game** — [reversing-deploy/index.html](reversing-deploy/index.html)
   (~3.2MB) plus [reversing-deploy/sw.js](reversing-deploy/sw.js). This is a
   single self-contained HTML file: all CSS and JS are inlined, audio assets
   are embedded, there is no build step, no framework, no `node_modules`
   dependency. This is what actually ships — see Deployment below. This is
   almost certainly what any "fix the game" / "add a feature" task means.
2. **A Nuxt 4 scaffold** — `app/`, `nuxt.config.ts`, `dist/`. This is still
   the default `create-nuxt` starter (`app/app.vue` renders
   `<NuxtWelcome/>`). It is **not wired to the game** and is not what
   Netlify serves. Don't assume game changes belong here.

Full gameplay rules and mechanics are documented in [spec.md](spec.md).
Current build/deploy status and known gaps are in [state.md](state.md).

## Editing the game

`reversing-deploy/index.html` is hand-edited directly — there is no
compiler, bundler, or transpiler for it. Search within the file for the
relevant `function` (it's organized as flat top-level functions, e.g.
`drawNextClip`, `awardPoint`, `renderScoreTab`, `persist`) rather than
expecting a component/module structure. State lives in a single in-memory
`state` object and is written to `localStorage` via `persist()` /
`persistGameHistory()` / `persistMyClipsIndex()` — any change to shape of
`state` needs a corresponding read/write update in those functions.

Audio handling uses the Web Audio API directly (`AudioContext`,
`bufferToWav`, manual buffer reversal) — there's no audio library.

There is no test suite or lint config for this file; verify changes by
opening it in a browser (see Running locally below).

## Running locally

**The game** (`reversing-deploy/`) is static — no dev server required to
run it; open `reversing-deploy/index.html` directly in a browser, or serve
the directory with any static file server for correct PWA/service-worker
behavior (`sw.js` requires an HTTP origin, not `file://`).

**The Nuxt scaffold** (unused by the live site, but if working on it):
```bash
npm install       # installs deps, runs `nuxt prepare` postinstall
npm run dev        # dev server at http://localhost:3000
npm run build       # production build to .output
npm run generate     # static generation to dist/
npm run preview      # preview a production build locally
```
No test or lint scripts are defined in `package.json`.

## Deployment

Netlify publishes the **`reversing-deploy/`** directory as-is
([netlify.toml](netlify.toml): `publish = "reversing-deploy"`). The Nuxt
`dist/` build output is not the deploy target. To ship a game change,
editing and committing `reversing-deploy/index.html` (and `sw.js` if
caching behavior changes) is sufficient — there's nothing to build first.
