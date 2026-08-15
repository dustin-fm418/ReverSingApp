# Scoring & Reveal

`reversing-deploy/index.html:1363–1499` (AWARD/SCORE, REVEAL, WIN
CELEBRATION, SCORE TAB sections)

## What it owns

Turning a round's outcome into a score change, the reveal-the-answer UI,
the live scoreboard, and the win celebration.

## Reveal

`revealAnswer()` is a one-way gate (`state.revealed`, checked so it can't
fire twice per round): shows the clip's real title in place of the hidden
placeholder, enables the award buttons, disables **Reveal** itself, and
enables **Skip Round**.

## Award / Skip

- `renderAwardGrid()` builds one button per team; each is disabled unless
  `state.roundActive && state.revealed` — you can't award points before
  revealing, and can't award into a round that's already over.
- `awardPoint(teamIndex)` — increments that team's score, persists
  settings/teams, and calls `endRound()` (see [Round Flow](round-flow.md))
  to advance to the next team.
- `skipRound(teamIndex)` — same gating, just calls `endRound()` without a
  score change (used when nobody could guess it).

## Score tab (`renderScoreTab`)

Renders the live per-team scoreboard on the 🏆 **Score** tab, with manual
`+` / `−` adjust controls per team for correcting mistakes without going
through a round. Checks `winner = teams.find(t => t.score >= pointsToWin)`
on every render; the first time a winner is detected
(`state.winCelebrated` guard prevents re-firing), it shows the winner
banner, calls `recordGameToHistory(winner)` (see
[Game History](game-history.md)), and fires `celebrateWin()`.

## Win celebration

`celebrateWin()` combines three independent effects, each already built
elsewhere:

- `launchConfetti()` — spawns ~36 short-lived colored DOM divs with random
  CSS animation, self-removing after ~3.8s.
- `hapticBuzz([...])` — a 4-pulse vibration pattern (see
  [Audio Engine](audio-engine.md)'s `hapticBuzz`, actually defined in the
  timer section but used here too).
- `playCelebrationChime()` — a synthesized 4-note "ta-da" (C5 E5 G5 C6)
  using the same raw-oscillator approach as the countdown ticks, not a
  recorded/reversed clip.
