# My Voice Clips

`reversing-deploy/index.html:1655–1972`

## What it owns

The 🔴 **Record** tab: recording/uploading clips, tagging them with a
title and difficulty, and the whole clip's lifecycle (save, delete,
export, import). This is the only source of playable content in the game
(see [Game State](game-state.md) — `CLIPS` has no built-in sample data).

## Storage shape

- Index: `state.myClips` — an array of lightweight metadata objects
  `{id, title, category, visibility, createdAt}`, persisted as a whole
  under `reversing:myclips:index:v1`.
- Audio: stored **separately per clip**, one `Store` key per clip —
  `reversing:myclip-audio:<id>` — holding the *already-reversed* audio as a
  base64 WAV string. Keeping audio out of the index means the index stays
  cheap to load/save even with many clips.
- `myClipBufferCache` — an in-memory `id -> decoded AudioBuffer` cache so a
  clip already used this session doesn't get re-decoded from base64 every
  time it's drawn.
- `refreshMyClipsInLibrary()` rebuilds the `pack: "mine"` entries in the
  shared `CLIPS` array (see [Game State](game-state.md)) from
  `state.myClips` + the buffer cache, decoding from `Store` only for clips
  not already cached. This is the bridge between this component's own
  storage and the pool [Round Flow](round-flow.md) draws from.

## Recording flow

1. `startClipRecording()` — grabs the shared mic stream (see
   [Audio Engine](audio-engine.md)), records via `MediaRecorder` for a
   **fixed 5 seconds** (`setTimeout(... , 5000)` auto-stops it; a visible
   1-second countdown mirrors this), decodes on stop, reverses it
   (`reverseBuffer`), and stores both `{forward, reversed}` in
   `state.pendingRecording` — not saved yet.
2. The preview card lets the user listen to both directions, type a title,
   pick a category, and set visibility, before `savePendingRecording()` or
   `discardPendingRecording()`.
3. `savePendingRecording()` — defaults an empty title to `"Untitled Clip
   N"` (the help text stresses titles matter: whatever's typed here is
   shown verbatim on Reveal Answer). Encodes the *reversed* buffer to WAV,
   base64s it, writes both the audio key and the updated index, refreshes
   the in-memory library, and — notably — **auto-enables the clip's
   category** in `activeMyClipCategories` if it wasn't already on, so a
   freshly recorded clip is always immediately playable. Clears the
   shuffle bag since pool size/contents changed.
4. `deleteMyClip(id)` — confirms, then removes the clip from the index,
   the buffer cache, and its `Store` audio key.

## Upload flow

- `handleUploadedFile(file)` (wired from the file `<input>`) decodes an
  arbitrary audio file, truncates it to `MAX_UPLOAD_SECONDS` (15s) via
  `truncateBuffer`, reverses it, and feeds it into the same preview →
  save path as a live recording.
- The same input also accepts a previously **exported clip package** (see
  below) — `handleUploadedFile` detects the `{"type":"reversing-clip"}`
  JSON shape vs. a plain audio file and routes accordingly.

## Export / import ("clip packages")

Local-file based, not cloud sync (the code comments are explicit that
cloud sync/account-based sharing was a considered future step, not
implemented):

- `clipToPackage(meta, audioBase64)` builds a JSON object
  `{type: "reversing-clip", version: 1, title, category, visibility,
  createdAt, audioWavBase64}`.
- `downloadClipPackage(id)` / `exportAllClips()` — trigger a browser
  download of one clip, or every clip, as `.json` file(s) via
  `downloadJson()`.
- `importClipPackage(pkg)` — the inverse: takes a package object, writes
  its audio + metadata into `Store` under a freshly generated id, and adds
  it to `state.myClips`. This is reused (not re-implemented) by
  [Init & Playtest Seed](init-and-playtest-seed.md) to bulk-load the
  temporary test clips.

## Rendering

`renderMyClipsSection()` rebuilds the clip list on the Record tab;
`renderCategoryOptions()` populates the difficulty `<select>` in the
preview card from `CATEGORIES` (defined in [Sound Packs](sound-packs.md)).
