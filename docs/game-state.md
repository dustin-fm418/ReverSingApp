# Game State

`reversing-deploy/index.html:1020–1123`

## What it owns

The single in-memory `state` object every other component reads and
mutates directly (no reducer/action pattern — plain shared mutable state),
plus the module-level `CLIPS` array, `DEFAULTS`, and cached DOM element
references used throughout the app.

## `CLIPS` — Clip Library

`let CLIPS = []` starts empty. There is **no built-in sample content** —
the entire pool is populated at runtime from the user's own recorded clips
via `refreshMyClipsInLibrary()` in [My Voice Clips](my-voice-clips.md). (The
[Init & Playtest Seed](init-and-playtest-seed.md) block seeds a few clips
automatically for playtesting, but that's temporary and meant to be
deleted before real launch.)

## `DEFAULTS` and `state`

`DEFAULTS` is the factory-reset shape for `settings` and `teams`. `state`
is initialized as a deep copy of `DEFAULTS` plus a large set of
session/runtime fields that are never persisted: `performingIndex`,
`shuffleBag`, `currentClip`, `roundActive`, `timerRemaining`,
`isRecording`, `sharedMicStream`, `mediaRecorder`, `pendingRecording`,
`winCelebrated`, etc.

Only two fields are round-tripped to `Store`:

- `settings` and `teams` — via `persist()` / `restore()`, key
  `reversing:state:v1` (see [Storage Bridge](storage-bridge.md)).
- Everything else in `state` is transient/derived and rebuilt on load —
  `myClips` and `gameHistory` are loaded separately by their own
  components ([My Voice Clips](my-voice-clips.md),
  [Game History](game-history.md)) rather than living in this blob.

## Migrations

`restore()` runs a few one-time compatibility fixups on load, since
`settings` is persisted as free-form JSON with no schema/version field:

- Strips the retired `"demo"` and `"mine"` entries out of
  `settings.activePacks` (an earlier version gated "My Voice Clips" through
  the pack-toggle system; that's now controlled by
  `activeMyClipCategories` instead — see [Sound Packs](sound-packs.md)).
- Backfills `activeMyClipCategories` if it's ever not an array.
- Clamps `roundSeconds` into `[30, 90]` — the max used to be 180s in an
  earlier build; this keeps old saved values from disagreeing with the
  current slider.

Any future change to what's stored under `reversing:state:v1` needs a
similar guard here, since there's no migration framework — just ad hoc
checks run every load.

## DOM refs

A large block of `const btnX = el("...")` lookups happens once at load and
is reused everywhere — `el = id => document.getElementById(id)`. There's no
templating; markup is written directly in the HTML body and these
components read/mutate it imperatively.
