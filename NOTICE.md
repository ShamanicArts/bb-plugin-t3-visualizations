# Upstream attribution

The original inline HTML visualization feature was created by **Ben Davis
([@bmdavis419](https://github.com/bmdavis419))** for T3 Code:

- Original contribution: https://github.com/pingdotgg/t3code/pull/15916
- Subsequent upstream integration and fixes: https://github.com/pingdotgg/t3code/pull/15968
- Source snapshot used by this plugin: https://github.com/pingdotgg/t3code/tree/99db70cf1a1f24deca80e40a94a6cdbbaf511da6

PR #15968 explicitly credits Ben's original feature and preserves his two
commits. That upstream integration includes work by Theo Browne and other
T3 Code contributors. Credit for the original feature remains with Ben.

This BB plugin adapts:

- `lib/htmlRender.ts` from upstream `packages/shared/src/htmlRender.ts`.
- `lib/htmlRender.test.ts` from the corresponding upstream tests.
- `lib/themePalettes.ts` from the default palette subset of upstream
  `packages/shared/src/themePalettes.ts`.

The upstream code is copyright 2026 T3 Tools Inc. and licensed under MIT. Its
copyright and permission notice are retained in `LICENSE` and source headers.

The BB-specific integration is maintained by ShamanicArts and is also MIT
licensed. It connects the upstream HTML bootstrap to BB's existing inline and
pinned widgets, thread storage, CLI, agent tools, and live theme. This repository
is an independent adaptation, not an official T3 Code distribution.
