# Contextual Help

`reversing-deploy/index.html:2039–2103`

## What it owns

The "?" help modal content for each of the four tabs, and the logic that
auto-shows it the first time a player lands on a tab.

## Structure

`HELP_CONTENT` is a plain object keyed `play` / `score` / `record` /
`settings`, each with a `title` and an HTML `body` string (written as
string concatenation, not a template) — this is the single source of
truth for the in-app rules text and is what [spec.md](../spec.md)'s
gameplay-rules section was derived from. If gameplay rules change, this is
the place that must be kept in sync (the actual game logic and this help
copy can silently drift since nothing enforces they match).

## Behavior

- `helpKeyForTab(tabId)` maps DOM tab ids (`tab-play`, etc.) to the
  `HELP_CONTENT` keys.
- `openHelpModal(key)` populates and shows `#help-modal`.
- `maybeAutoShowHelp(tabId)` — checks `state.settings.seenHelp[key]`; the
  *first* time a given tab is visited it flips that flag, persists it, and
  opens the modal automatically. Every subsequent visit is silent unless
  the player taps the "?" button explicitly (wired in
  [Navigation, Theme & Wiring](navigation-and-wiring.md)).
