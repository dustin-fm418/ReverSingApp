# Component docs

These documents break down [`reversing-deploy/index.html`](../reversing-deploy/index.html)
— the single-file app that is the actual shipped game (see
[../CLAUDE.md](../CLAUDE.md) and [../state.md](../state.md) for why the repo
also contains an unrelated, unused Nuxt scaffold).

The file has no build step and no component framework — it's flat inline
`<script>`, organized internally into clearly delimited sections
(`/* === NAME === */` comments). Each doc below covers one of those
sections: what it owns, its key functions, and how it talks to the others.
Line numbers refer to `reversing-deploy/index.html` as of the v4 playtest
build (commit `0cb27cc`) and will drift as the file is edited.

| Component | File | Lines (approx.) |
|---|---|---|
| [Storage Bridge](storage-bridge.md) | storage-bridge.md | 843–875 |
| [Audio Engine](audio-engine.md) | audio-engine.md | 876–1019 |
| [Game State](game-state.md) | game-state.md | 1020–1123 |
| [Round Flow & Timer](round-flow.md) | round-flow.md | 1124–1362 |
| [Scoring & Reveal](scoring-and-reveal.md) | scoring-and-reveal.md | 1363–1499 |
| [Sound Packs & Clip Pool](sound-packs.md) | sound-packs.md | 1499–1607 |
| [Game History](game-history.md) | game-history.md | 1607–1655 |
| [My Voice Clips](my-voice-clips.md) | my-voice-clips.md | 1655–1972 |
| [Settings Tab](settings-tab.md) | settings-tab.md | 1972–2039 |
| [Contextual Help](contextual-help.md) | contextual-help.md | 2039–2103 |
| [Navigation, Theme & Event Wiring](navigation-and-wiring.md) | navigation-and-wiring.md | 2103–2257 |
| [Init & Playtest Seed](init-and-playtest-seed.md) | init-and-playtest-seed.md | 2257–2326 |
| [Service Worker (PWA)](service-worker.md) | service-worker.md | reversing-deploy/sw.js |

For gameplay rules from the player's perspective, see [../spec.md](../spec.md).
