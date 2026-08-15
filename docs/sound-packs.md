# Sound Packs & Clip Pool

`reversing-deploy/index.html:1499–1607`

## What it owns

The Settings-tab UI and state for controlling which clips are eligible for
`drawNextClip()` (see [Round Flow](round-flow.md)) — pack toggles and, for
the user's own clips, difficulty-category toggles.

## Data

- `CATEGORIES` — the four fixed difficulty tags: 🟢 Easy, 🟡 Medium, 🟠
  Difficult, 🔴 Insane! (`easy` / `medium` / `difficult` / `insane`).
- `PACKS` — currently three entries: `"mine"` ("My Voice Clips" —
  functional), plus `"pop"` and `"80s"` — both `locked:true` stub tiles
  with a "Get pack" button that just shows an alert explaining they're
  placeholders for a future in-app purchase. **There is no purchasable
  content today**; only user-recorded clips are ever playable.

## Filtering logic

Two independent toggle systems, because the "mine" pack behaves
differently from a normal pack:

- Ordinary packs: on/off via `togglePack(id)`, tracked in
  `settings.activePacks`. (Not currently exercised in practice since the
  only other packs are locked stubs.) `activeClipPool()` treats these as:
  `settings.activePacks.includes(c.pack)`.
- "My Voice Clips": filtered by **category**, not by a single pack
  on/off — `activeClipPool()` treats `pack === "mine"` clips as included
  iff `settings.activeMyClipCategories.includes(c.category)`.
  `toggleMyClipsMaster()` is a convenience "all on / all off" toggle across
  all four categories at once; `toggleMyClipCategory(id)` toggles one.

Any toggle here clears `state.shuffleBag = []` — the shuffle bag holds
indices into the *filtered* pool, so changing the filter invalidates it and
it's rebuilt lazily on next draw (see `refillShuffleBag()` in
[Round Flow](round-flow.md)).

## Rendering

`renderPackList()` rebuilds the whole `#pack-list` DOM node on every
relevant state change — no diffing, no framework, just
`innerHTML = ""` + rebuild. `buildMyClipsPackCard()` is the special case
for the "mine" pack: shows clip count, the master on/off toggle, and an
expandable per-category checklist (`state.myClipCategoriesExpanded`
tracks whether that's open).
