# Verification

- `npm test`: 30 tests passed, including the upstream bootstrap/protocol tests,
  BB host confinement and pin RPC checks, and a real headless Chromium test.
- `npm run typecheck`: passed against BB Plugin SDK 0.5.29.
- `bb plugin build`: generated compatible server and frontend bundles.
- Installed in the running BB app; plugin status is `running`.
- Published `examples/waves.html` through the live CLI and pinned its exact
  thread-storage file through Pinned Widgets' existing `pins_put` RPC.
- Opened the live pin in BB using headless Chromium. The frequency slider
  changed its output to 4.2; iframe foreground/background matched BB's active
  palette. The local verification screenshot is excluded from publication.
- Browser tests cover inline and pinned frames, light/dark changes without
  resetting interactions, opaque-origin isolation, reload, and disposal.
- Publishing now returns BB's `::inline-vis{source="thread-storage" ...}`
  directive. Agent-tool and CLI tests publish with pinning unavailable and
  assert zero cross-plugin RPC calls. A requested but unavailable pin leaves
  a working inline directive; successful optional pinning uses the same file.
- Verified the Warmap visualization in the running BB client with Pinned
  Widgets removed from the plugin list and contributions only in an isolated
  headless browser context. The built-in inline renderer loaded the real
  thread-storage artifact; filtering changed 75 revisions to 33, a live theme
  change preserved that selection, and no Pinned Widgets RPC was requested.
  No installed plugin or saved chat history was changed by this verification.

No desktop windows were opened. Browser preview uses existing BB infrastructure;
the test suite uses system Chromium without installing another browser.

Upstream implementation: pingdotgg/t3code commit
`99db70cf1a1f24deca80e40a94a6cdbbaf511da6`, MIT license retained.
