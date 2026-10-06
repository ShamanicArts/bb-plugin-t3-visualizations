Ben Davis's T3 Code widget styles, palettes, and authoring approach, adapted for BB's existing interactive HTML replies. BB already supports interactive HTML. This plugin brings presentation guidance and live theme integration to that capability.

## How it works

`t3_html_render` and `bb t3-visualizations render` apply the adapted T3 Code theme bootstrap to a self-contained HTML page and save it in BB thread storage. The returned `::widget` directive integrates with the separately installed Pinned Widgets plugin, which supplies the iframe, resize grips, expand action, pin controls, and remembered sizes. The same document is used inline and in the pin strip.

Pages receive BB's active theme and fonts, and follow appearance changes while preserving their interaction state. JavaScript executes in the existing opaque-origin sandbox. Embed local images as data URLs; remote resources follow browser loading policies.

## Requirements

Install and enable Pinned Widgets separately. It is a plugin we added to BB and is not included by default. This integration requires it. Browser preview uses BB's existing browser tooling. Native tools become available at the next provider session start. The CLI is available immediately.

## Attribution

The original T3 Code work is by [Ben Davis (@bmdavis419)](https://github.com/bmdavis419), introduced in [T3 Code PR #15916](https://github.com/pingdotgg/t3code/pull/15916). This plugin adapts that widget styling and authoring approach to BB. The HTML bootstrap, theme protocol, reference helpers, and tests are adapted from [T3 Code](https://github.com/pingdotgg/t3code), copyright 2026 T3 Tools Inc., under the MIT license. This is an independent BB integration.
