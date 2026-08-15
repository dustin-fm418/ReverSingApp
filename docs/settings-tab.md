# Settings Tab

`reversing-deploy/index.html:1972–2039` (rendering) + relevant handlers in
`2123–2256` (WIRE UP EVENTS)

## What it owns

The ⚙️ **Settings** tab: round timer, points-to-win, team count/names,
sound/haptic toggles, dark mode, and the two reset flows. Delegates sound
pack rendering to [Sound Packs](sound-packs.md).

## Rendering

`renderSettingsTab()` is a straightforward one-shot sync from `state` into
form controls (timer slider, points input, dark mode/haptic/sound
checkboxes) plus calls out to `renderTeamCountToggle`,
`renderTeamNameInputs`, and `renderPackList`.

## Teams

- `renderTeamCountToggle(containerId)` renders three chips (2/3/4 teams);
  `setTeamCount(n)` grows/shrinks `state.teams`, clamping
  `performingIndex` back in range if the active team was removed.
- `renderTeamNameInputs(containerId)` — each team gets a plain text input
  (20 char max), writing straight to `state.teams[i].name` on `input` and
  falling back to `"Team N"` if left blank.
- Both renderers are parameterized by `containerId` because the **same**
  team-count/name controls appear in two places: the Settings tab and the
  first-run setup modal (`finishSetup()` marks
  `settings.hasCompletedSetup` and only then can the setup modal be
  skipped in future sessions). `renderAllTeamControls()` refreshes both
  copies together so they can't drift out of sync.

## Settings inputs → state

Every input handler follows the same shape: mutate `state.settings.*`,
call `persist()`, then re-render whatever's affected. Two have extra
side effects worth knowing:

- Timer slider (`#input-timer`) also live-updates
  `state.timerRemaining`/the timer UI **if no round is currently active** —
  changing the setting mid-round doesn't retroactively shorten a round in
  progress.
- Dark mode checkbox calls `applyTheme()` immediately (see
  [Navigation, Theme & Wiring](navigation-and-wiring.md)).

## Two distinct resets

- **Reset for New Game** (`btn-reset-new-game` → `resetSettingsAndTeams()`)
  — restores `settings`/`teams` to `DEFAULTS`, resets round/timer UI, and
  **reopens the first-run setup modal**. Recorded clips and game history
  are untouched.
- **Reset All Data** (`btn-reset-all`, under the "Advanced" disclosure,
  behind an extra confirm with an explicit warning) — first calls
  `wipeAllClipsAndHistory()` (deletes every clip's audio from `Store`,
  clears `myClips` and `gameHistory`), *then* `resetSettingsAndTeams()`.
  This is the only path that touches recorded clips/history — everything
  else in the app treats those as durable.

Both destructive actions are gated behind native `confirm()` dialogs with
explicit, specific copy about what will be lost — there's no custom modal
for this, just the browser's built-in confirm.
