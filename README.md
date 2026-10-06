# T3 Visualizations for BB

[Ben Davis's](https://github.com/bmdavis419) widget styles and visual authoring
approach from [T3 Code](https://github.com/pingdotgg/t3code), adapted for
[BB](https://getbb.app)'s existing interactive HTML replies. Get more polished
charts, diagrams, and visual reports in your conversations, with colors and
fonts that follow your BB theme.

## Install

Requires BB 0.44 or later.

```sh
bb plugin install https://github.com/ShamanicArts/bb-plugin-t3-visualizations
```

After installation, start a new agent session in BB so it picks up the plugin.

## Using it

Ask your agent for a visual explanation. For example:

- “Show this project's recent changes as an interactive timeline.”
- “Compare these benchmark results in a chart.”
- “Draw an interactive diagram of how this codebase works.”

The agent creates the visualization and displays it in the conversation. You
can explore its controls there, and it follows changes to your BB theme.

If you also use [Pinned Widgets](https://github.com/ShamanicArts/bb-plugin-pinned-widgets),
you can ask the agent to keep a visualization above the composer. That
integration is optional; T3 Visualizations works on its own.

## For agents

Follow the [visualization authoring skill](skills/t3-visualizations/SKILL.md)
for layout, theme variables, HTML limits, and preview instructions. Publish
with `t3_html_render`, or use the CLI:

```sh
bb t3-visualizations render chart.html --title "Model usage" --height 640
```

Emit the returned `::inline-vis` directive as its own block in the assistant
reply. The default height is 640 pixels; supported heights are 120–1200 pixels.
Only request pinning (`pin: true` or `--pin`) when the user asks for it and the
optional Pinned Widgets plugin is installed.

## Development

```sh
npm ci
npm test
npm run typecheck
bb plugin build
bb plugin install .
```

The browser test runs headlessly using `/usr/bin/chromium`. Set
`T3_TEST_CHROMIUM` to another Chromium executable if needed. The SDK version is
pinned in `package.json`.

See [the waves example](examples/waves.html) for a sample visualization and
[VERIFICATION.md](VERIFICATION.md) for the integration checks.

## Credits and license

The original T3 Code work is by **Ben Davis (@bmdavis419)** in
[PR #15916](https://github.com/pingdotgg/t3code/pull/15916), carried forward by
Theo Browne and the T3 Code contributors in
[PR #15968](https://github.com/pingdotgg/t3code/pull/15968).

This is an independent BB adaptation under the [MIT license](LICENSE). T3's
copyright and permission notice are retained. See [NOTICE.md](NOTICE.md) for
the source snapshot and attribution details.
