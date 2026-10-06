# T3 Visualizations for BB

Ben Davis's T3 Code widget styles and authoring approach, adapted for
[BB](https://getbb.app)'s existing interactive HTML replies. BB already supports
interactive HTML; this plugin contributes presentation styles, palettes,
authoring guidance, and live theme integration.

Based on the original T3 Code work by **[Ben Davis
(@bmdavis419)](https://github.com/bmdavis419)** in
[T3 Code PR #15916](https://github.com/pingdotgg/t3code/pull/15916).
This is an independent BB integration, released under the [MIT license](LICENSE).

## Install

This integration requires **Pinned Widgets**, a separate plugin we added to BB.
It is not included in BB by default. Install and enable that plugin separately,
then install T3 Visualizations:

```sh
bb plugin install https://github.com/ShamanicArts/bb-plugin-t3-visualizations
```

Requires BB 0.44 or later and Plugin SDK 0.5.29 or later. The CLI is available
after installation; the `t3_html_render` agent tool is available in a new
provider session.

## Use

Write a self-contained HTML page in the current BB thread's workspace, then:

```sh
bb t3-visualizations render chart.html --title "Model usage" --height 640
```

Emit the returned `::widget` directive in an assistant reply. Use the widget's
**Pin to bar** control, or add `--pin` to keep it above the composer.
Heights range from 120 to 1200 pixels; the default is 640.

Use BB's CSS theme variables, including `--background`, `--foreground`,
`--primary`, `--chart-1` through `--chart-6`, `--font-sans`, and `--font-mono`.
The page follows live theme changes without resetting its interaction state.
Embed local images as data URLs and keep the HTML under 512,000 characters.
See [the authoring skill](skills/t3-visualizations/SKILL.md) and
[the interactive waves example](examples/waves.html).

## Develop

```sh
npm ci
npm test
npm run typecheck
bb plugin build
bb plugin install .
```

The browser test uses system Chromium at `/usr/bin/chromium`; set
`T3_TEST_CHROMIUM` to your browser's executable path on other systems.
Tests run headlessly without opening desktop windows.

Artifacts use BB's existing thread
storage, host confinement, and preview transport. The frontend supplies only
the live theme bridge. Browser preview uses existing BB tools.

## Credits and provenance

The original feature was authored by **Ben Davis (@bmdavis419)** in
[PR #15916](https://github.com/pingdotgg/t3code/pull/15916). Theo Browne and the
T3 Code contributors carried it forward in
[PR #15968](https://github.com/pingdotgg/t3code/pull/15968), which explicitly
credits and retains Ben's work. Thanks to Ben for the original implementation
and to the T3 Code contributors for making it available under MIT.

This plugin adapts the HTML bootstrap, theme protocol, reference helpers,
default palette subset, and relevant tests from
[T3 Code at `99db70cf1a1f24deca80e40a94a6cdbbaf511da6`](https://github.com/pingdotgg/t3code/tree/99db70cf1a1f24deca80e40a94a6cdbbaf511da6).

The BB adaptation supplies styling and authoring guidance, a theme request
handshake, a native agent tool, and a CLI. It uses BB's existing HTML capability
and thread storage, and the separately installed Pinned Widgets plugin's widget
controls. See [NOTICE.md](NOTICE.md) for exact
source attribution. The upstream copyright and MIT permission notice are
retained in [LICENSE](LICENSE).
