# Game History

`reversing-deploy/index.html:1607–1655`

## What it owns

A running log of completed games, shown on the 🏆 **Score** tab below the
live scoreboard.

## Behavior

- Persisted independently of `settings`/`teams`, under its own key
  `reversing:history:v1` (see [Storage Bridge](storage-bridge.md)) via
  `loadGameHistory()` / `persistGameHistory()`.
- `recordGameToHistory(winner)` is called exactly once per finished game —
  from `renderScoreTab()` in [Scoring & Reveal](scoring-and-reveal.md), the
  moment a team first crosses `pointsToWin` (guarded by
  `state.winCelebrated` so it can't double-fire on re-render). Each entry
  snapshots every team's name/final score, the winner's name, and the
  `pointsToWin` target at the time — so history stays meaningful even if
  the points target is changed later.
- `renderGameHistory()` rebuilds the list, most recent first
  (`unshift` on write), sorting each entry's teams by score descending and
  marking the winner row.
- Explicitly **not** cleared by "Reset for New Game" in
  [Settings](settings-tab.md) — only "Reset All Data" wipes it, alongside
  recorded clips.
