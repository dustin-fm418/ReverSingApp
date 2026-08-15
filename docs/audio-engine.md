# Audio Engine

`reversing-deploy/index.html:876–1019`

## What it owns

All raw audio work: capture, decode, reverse, playback, and the WAV/base64
encoding used to make audio JSON-storable. Every other component that
touches sound goes through these functions rather than the Web Audio API
directly.

## Key functions

- `getCtx()` — lazily creates/resumes the single shared `AudioContext`.
- `reverseBuffer(buffer)` — returns a new `AudioBuffer` with every channel's
  samples in reverse order. This is the one line the entire game is built
  around.
- `truncateBuffer(buffer, maxSeconds)` — caps buffer length (used to enforce
  the upload duration limit, see [My Voice Clips](my-voice-clips.md)).
- `playBuffer(buffer, onEnded)` / `stopPlayback()` — plays a buffer through
  a single tracked `activeSource`, stopping any prior playback first (so
  overlapping sounds can't happen).
- `getSharedMicStream()` — requests `getUserMedia({audio:true})` **once**
  and caches the `MediaStream` on `state.sharedMicStream`, reused by both
  in-round mimicry recording and My Voice Clips recording. This exists
  specifically to avoid repeat permission prompts on some mobile
  browser/OS combos. If the stream's track ends unexpectedly (permission
  revoked, device unplugged), an `ended` listener clears the cache so the
  next recording attempt re-requests instead of reusing a dead stream.
- `micErrorMessage(err)` — maps `getUserMedia` failure modes (no
  `mediaDevices` at all vs. `NotAllowedError` vs. `NotFoundError`) to a
  specific, actionable message rather than one generic "mic failed" string.
- `bufferToWav(buffer)` — encodes an `AudioBuffer` to a WAV `Blob` (manual
  RIFF header construction, 16-bit PCM). Needed because `Store` only
  persists JSON/text, not binary.
- `blobToBase64` / `base64ToBlob` / `decodeWavBase64` — round-trip a
  `Blob` through base64 so it can live inside a JSON value in `Store`.

## Consumers

- [Round Flow & Timer](round-flow.md) — plays the current clip, records and
  plays back mimicry.
- [My Voice Clips](my-voice-clips.md) — records, reverses, and
  encodes/decodes clip audio for storage and export/import.
- Countdown ticks and the win chime (in [Scoring & Reveal](scoring-and-reveal.md))
  synthesize tones directly via `getCtx()` rather than calling into this
  file — they're one-off oscillator sounds, not recorded audio.
