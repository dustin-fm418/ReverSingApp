# Navigation, Theme & Event Wiring

`reversing-deploy/index.html:2103–2257` (TAB NAVIGATION, THEME, WIRE UP
EVENTS sections)

## What it owns

Tab switching, the dark/light theme toggle, and the app's **entire** event
wiring — every button/input handler in the app is attached here, once, at
script load. There's no delegated event system or component-local
listeners; this section is the single map from DOM element to behavior.

## Tab navigation

`showTab(id)` toggles the `.active` class on the matching `.tab-panel` and
nav button, shows/hides the timer bar and performing-team pill (only
relevant on the Play tab), updates the help button's `aria-label` to match
the current tab's help title, and calls `maybeAutoShowHelp(id)` (see
[Contextual Help](contextual-help.md)).

## Theme

`applyTheme()` toggles a class on `<body>`/root based on
`state.settings.darkMode`; called on load and whenever the dark-mode
checkbox changes.

## Event wiring — what's attached where

This section is the best single map of "what does button X do" — grouped
roughly by tab:

- **Play tab**: `btnPlayClip` (start round / replay clip), `btnRecord`
  (toggle mimicry recording), `btnPlayMimicry`, `btnReveal`, `btnSkip` — all
  delegate straight into [Round Flow](round-flow.md) /
  [Scoring & Reveal](scoring-and-reveal.md) functions.
- **Record tab**: record/upload/export buttons wired into
  [My Voice Clips](my-voice-clips.md) functions. Note the upload
  `<input>`'s `onchange` resets `inputUploadClip.value = ""` after reading
  the file — otherwise picking the *same* file twice in a row wouldn't
  re-fire the change event.
- **Bottom nav** — a single `forEach` over `.nav-btn` wires all four tabs
  to `showTab`.
- **Help modal** — open via the `?` button (keyed to the currently active
  tab), close via the explicit close button or by clicking the backdrop
  itself (`e.target.id === "help-modal"` check so clicks inside the card
  don't close it).
- **First-run setup modal** — `finishSetup()` is the same
  click-backdrop-to-dismiss pattern as the help modal, and is also what
  flips `settings.hasCompletedSetup` (see [Settings Tab](settings-tab.md)
  for how that gate is used).
- **Settings inputs** — timer slider, points-to-win, dark mode, haptic,
  sound toggles, reset-scores, clear-history, and the two reset flows
  (`resetSettingsAndTeams`, `wipeAllClipsAndHistory`) — see
  [Settings Tab](settings-tab.md) for what each does.

Because everything is wired imperatively in one place at load time, adding
a new interactive control means both adding markup elsewhere in the file
*and* adding its handler here — there's no auto-binding convention to rely
on.
