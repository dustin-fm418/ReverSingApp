# ReverSing! — Game Spec

A party game, played in person on one shared phone/tablet. Someone records a
short clip of themselves singing or saying a song lyric or phrase. The app
reverses the audio. Everyone hears the backwards gibberish and has to mimic
it — sing it back exactly as it sounds, backwards. When *that* recording gets
reversed again, if the mimicry was close enough, it flips back into something
recognizable, and the team has to guess what it originally was.

## Core Loop (per round)

1. **Play Reversed Clip** — the app plays a backwards clip drawn from the
   active pool. Can be replayed, but the round timer is running.
2. **Record Mimicry** — the performer (on the active team) tries to copy the
   backwards sound as closely as possible and records their attempt.
3. **Play It Reversed** — the app reverses the *mimicry* recording. If it was
   a good copy, it should now sound close to the original clip. The
   performer can re-record and retry if time allows.
4. **Guess** — the active team must agree on an answer before the timer
   expires, then lock it in.
5. **Reveal Answer** — shows the clip's title (the real song/phrase).
   - Correct guess → tap that team to award them a point.
   - Time runs out before consensus → the *next* team in rotation gets to
     guess from the same recording (no re-recording at this stage).
   - Nobody can get it → once the group agrees, reveal the answer and tap
     **Skip Round** to move on.
6. First team to reach the point target wins (default: **11**, configurable).

## Teams & Scoring

- 2–4 teams, each with an editable name (default "Team N", 20 char max).
- Teams rotate as "performing" team round to round.
- Score tab shows live scores for all teams, with manual **+ / −** adjust
  buttons for correcting mistakes.
- A winner banner appears automatically once a team hits the points target.
- "Reset all scores to 0" clears scores only, keeping teams/settings intact.

## Voice Clips ("My Voice Clips")

- Record live (~5 second clip) or upload an existing audio file — both are
  reversed the same way and stored for play.
- **Title is the answer.** Whatever is typed as the clip title is shown
  verbatim on Reveal Answer, so it must be the actual song/phrase, not a
  placeholder.
- **Difficulty** is a self-graded, subjective tag applied after listening to
  the *reversed* version:
  - 🟢 Easy
  - 🟡 Medium
  - 🟠 Difficult
  - 🔴 Insane!
- Clips can be exported as a package (JSON) and re-imported later, restoring
  title/category/difficulty without retyping.
- Clips can belong to categories/visibility groupings and be individually
  deleted.

## Sound Packs

- The clip pool for a game is controlled by **Sound Packs** — collections of
  clips (including the built-in "My Voice Clips" pack) that can be toggled
  on/off wholesale, or filtered further by difficulty category.
- The active pool determines what `drawNextClip()` can select from; clips
  are pulled from a shuffle bag (`refillShuffleBag`) so repeats are
  minimized within a pass.

## Settings

| Setting | Range / Options | Default |
|---|---|---|
| Round Timer | 30–90 seconds | 90s |
| Points to Win | configurable | 11 |
| Teams | 2–4, each renameable | — |
| Sound Packs | toggle per pack / per category | all on |
| Appearance | Dark / Light mode | Dark |

- **Reset for New Game**: clears scores, restores default teams/settings;
  keeps recorded clips and game history.
- **Reset All Data** (Advanced, destructive): factory reset — also deletes
  every recorded clip and all game history. Irreversible, gated behind a
  confirmation warning.

## Navigation

Bottom nav with four tabs, each with its own contextual "?" help modal that
auto-opens the first time a player lands on it:

- 🎤 **Play** — the active round (timer, clip playback, mimicry recording,
  reveal/score controls).
- 🏆 **Score** — live scoreboard.
- 🔴 **Record** — "My Voice Clips" library (record/upload/manage clips).
- ⚙️ **Settings** — timer, points, teams, sound packs, appearance, reset.

First-time setup shows a modal to choose team count and name teams before
the first game.

## Data & Persistence

- All state (teams, settings, scores, clip index, game history) persists to
  the browser via `localStorage` (`persist()`, `persistGameHistory()`,
  `persistMyClipsIndex()`) — fully client-side, no backend.
- Reversed audio decoding/caching is done with the Web Audio API
  (`AudioContext`, `bufferToWav`, in-memory `id -> decoded reversed
  AudioBuffer` map).
- Game history is recorded per finished game for later review
  (`recordGameToHistory`, `renderGameHistory`).
- Installable as a PWA (manifest-style meta tags, `sw.js` service worker) for
  offline play on a phone during game night.

## Platform / Non-goals

- Single shared device, pass-and-play — not networked multiplayer.
- Mobile-first responsive layout; works on desktop but designed for a phone
  or tablet passed around the table.
- No accounts, no server, no analytics — everything lives on-device.
