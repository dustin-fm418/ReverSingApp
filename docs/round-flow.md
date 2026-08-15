# Round Flow & Timer

`reversing-deploy/index.html:1124–1362` (REEL/TAPE VISUAL STATE, TIMER,
CLIP/ROUND FLOW, and RECORDING sections)

## What it owns

Everything about running a single round: drawing a clip, the countdown
timer, playing the reversed clip, capturing the mimicry recording, and the
"cassette reel" visual state. This is the engine behind the 🎤 **Play** tab.

## Clip selection

- `activeClipPool()` — filters `CLIPS` down to whatever's enabled in
  Settings (see [Sound Packs](sound-packs.md) for the filtering rules).
- `refillShuffleBag()` / `drawNextClip()` — a Fisher–Yates-shuffled index
  bag (`state.shuffleBag`) drawn from until empty, then reshuffled. This is
  what keeps clips from repeating back-to-back within a pass through the
  pool, without needing to track full play history.

## Round lifecycle

1. `startNewRound()` — stops any playback/timer, draws a clip via
   `drawNextClip()`, resets round UI state, starts the timer
   (`startTimer()`), and immediately plays the clip reversed
   (`playCurrentClip()`). If the pool is empty, it shows a specific reason
   why (no clips recorded / all categories off / none match) instead of a
   generic empty state.
2. Player taps **Record Mimicry** → `toggleRecording()` captures mic audio
   via `getSharedMicStream()` (see [Audio Engine](audio-engine.md)), decodes
   it, and reverses it into `state.mimicryReversedBuffer`.
3. **Play It Reversed** → `playMimicryReversed()` plays that buffer back.
4. Reveal/score/skip is handled in [Scoring & Reveal](scoring-and-reveal.md)
   (`revealAnswer()`, `awardPoint()`, `skipRound()`), which calls back into
   `endRound()` here.
5. `endRound()` — stops timer/playback, advances
   `state.performingIndex` to the next team (round-robin), resets the
   timer display and round UI for the next round.

## Timer

- `startTimer()` / `stopTimer()` run a 1-second `setInterval` against
  `state.timerRemaining`, seeded from `settings.roundSeconds` (30–90s).
- `updateTimerUI()` drives the readout text, the fill-bar width, and an
  `.urgent` CSS class once ≤15s remain.
- Countdown cues (`playCountdownCue`) fire haptic buzz + a synthesized tone
  at the 10s mark and every second from 5→0, each independently gated by
  `settings.hapticEnabled` / `settings.soundEnabled`. These tones are
  generated directly with oscillators here — they don't go through the
  recorded-clip playback path in [Audio Engine](audio-engine.md).

## Reel/tape visual

`setReelMode(mode)` toggles CSS animation classes on the reel/tape DOM
elements for three states — `"clip"`, `"record"`, `"mimicry"` — purely
cosmetic, no state implications.
