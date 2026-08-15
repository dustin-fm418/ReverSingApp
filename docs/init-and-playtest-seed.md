# Init & Playtest Seed

`reversing-deploy/index.html:2257–2326`

## `init()`

The app's single entry point, called once at the bottom of the script
(`init();`). In order: `restore()` settings/teams, `applyTheme()`,
`loadMyClips()`, seed playtest clips (see below), rebuild `CLIPS` from
storage (`refreshMyClipsInLibrary()`), `loadGameHistory()`, then render
every tab and either open the first-run setup modal
(`!settings.hasCompletedSetup`) or jump straight to the Play tab.

After `init()`, the service worker is registered (only over http/https,
never for a `file://` open) for offline support — see
[Service Worker](service-worker.md).

## ⚠️ Temporary playtest seed — flagged for removal before real launch

This block is explicitly marked in the source itself:

> `TEMPORARY PLAYTEST SEED — DELETE THIS ENTIRE BLOCK BEFORE REAL LAUNCH.`

`seedTempPlaytestClips()` auto-imports a fixed set of clip packages
(`TEMP_SEED_CLIPS`, reusing `importClipPackage()` from
[My Voice Clips](my-voice-clips.md)) the first time the app runs in a given
browser, gated by the `reversing:tempSeedApplied:v1` flag so it doesn't
re-import on every reload. Purpose: playtesters get clips ready to go
without manually recording/uploading anything.

**This is still present in the deployed `reversing-deploy/index.html`**
(the file that Netlify actually serves — see [../CLAUDE.md](../CLAUDE.md)),
i.e. it is live in production, not just in a dev build.

Two things worth flagging before a real launch:

1. **It's a known TODO**, already noted in [../state.md](../state.md) as
   an open gap — the source comment gives exact removal instructions:
   delete the whole block, and remove the single
   `await seedTempPlaytestClips();` line inside `init()`.
2. **The seed data itself includes a real, recognizable pop song** — one of
   the five bundled `TEMP_SEED_CLIPS` entries is titled *"I Wanna Hold Your
   Hand - The Beatles"*, with actual recorded audio of it embedded as
   base64 WAV directly in the source (the other four are public-domain/
   generic phrases: "Happy Birthday", "If You're Happy and You Know It",
   "Jesus Paid It All", "I Like to Move It"). Shipping a copyrighted
   commercial recording embedded in a public static site is a real
   copyright exposure independent of the general "delete before launch"
   note — worth confirming this seed is pulled (or at least that clip is)
   before treating any build as a public/real release rather than an
   internal playtest.
