# Storage Bridge

`reversing-deploy/index.html:843–875`

## What it owns

A thin persistence abstraction, `Store`, with `get(key)` / `set(key,
value)` / `delete(key)`.

## Key detail

It wraps `window.storage` — the storage API injected when this page runs
inside a Claude.ai Artifact sandbox — and falls back to a plain in-memory
object (`memFallback`) when `window.storage` isn't present, e.g. when the
file is downloaded and opened directly, or self-hosted (which is how it's
actually deployed, on Netlify).

This is a strong signal the game originated as a Claude Artifact and was
later exported to a standalone file for real deployment. The in-memory
fallback means: **if `window.storage` is ever unavailable in the deployed
context, nothing actually persists across page loads** — every `Store.set`
silently succeeds into a JS object that vanishes on refresh. On the real
Netlify deployment there is no `window.storage`, so confirm the fallback
path is what's actually exercised in production before assuming any
`persist()` call survives a reload in the field.

## Keys in use (all through this one abstraction)

| Key | Written by |
|---|---|
| `reversing:state:v1` | [Game State](game-state.md) — `persist()` / `restore()` |
| `reversing:history:v1` | [Game History](game-history.md) |
| `reversing:myclips:index:v1` | [My Voice Clips](my-voice-clips.md) |
| `reversing:myclip-audio:<id>` | [My Voice Clips](my-voice-clips.md) — one entry per recorded clip's audio |
| `reversing:tempSeedApplied:v1` | [Init & Playtest Seed](init-and-playtest-seed.md) |

Everything else in the app reads/writes state through these five keys —
there is no other persistence layer, no backend, no IndexedDB.
