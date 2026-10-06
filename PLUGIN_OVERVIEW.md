Charts, interactive diagrams, small simulations, and visual reports can appear directly in a reply, then stay above the composer with **Pin to bar**.

## How it works

`t3_html_render` and `bb t3-visualizations render` add T3 Code's theme bootstrap to a self-contained HTML page and save it in BB thread storage. The returned `::widget` directive uses Pinned Widgets' existing iframe, resize grips, expand action, pin controls, and remembered sizes. The same document is used inline and in the pin strip.

Pages receive BB's active theme and fonts, and follow appearance changes while preserving their interaction state. JavaScript executes in the existing opaque-origin sandbox. Embed local images as data URLs; remote resources follow browser loading policies.

## Requirements

Enable BB's Pinned Widgets plugin. Browser verification uses BB's existing browser tooling; no separate browser is installed. Native tools become available at the next provider session start. The CLI is available immediately.

## Attribution

The original inline HTML visualization feature is by [Ben Davis (@bmdavis419)](https://github.com/bmdavis419), introduced in [T3 Code PR #15916](https://github.com/pingdotgg/t3code/pull/15916). The HTML bootstrap, theme protocol, reference helpers, and tests are adapted from [T3 Code](https://github.com/pingdotgg/t3code), copyright 2026 T3 Tools Inc., under the MIT license. This is an independent BB integration.
