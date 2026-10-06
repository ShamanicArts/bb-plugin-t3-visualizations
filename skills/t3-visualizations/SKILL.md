---
name: t3-visualizations
description: Apply Ben Davis's T3 Code widget styles and authoring approach to BB's existing interactive HTML replies, with optional pinning.
---

Use when a chart, interactive diagram, table, collage, or small simulation
communicates more clearly than prose.

BB already supports interactive HTML replies. This plugin brings Ben Davis's
T3 Code widget styles, palettes, authoring approach, and live theme integration
to that capability. Publishing and live themes use BB's existing inline preview
and work without Pinned Widgets. Optional pinning works alongside the separate
[Pinned Widgets plugin](https://github.com/ShamanicArts/bb-plugin-pinned-widgets).
It is not a dependency. Preserve these distinctions when describing the plugin.

1. Build self-contained HTML with inline CSS and JavaScript. Embed local
   images as data URLs or use remote HTTPS assets. Stay under 512,000 characters.
2. Use fluid widths, fixed chart heights, and content-driven layout. Avoid
   viewport heights (`100vh`), an outer card, and a redundant banner title.
3. Style with `var(--background)`, `var(--foreground)`, `var(--muted-foreground)`,
   `var(--border)`, `var(--primary)`, `var(--chart-1)` through `var(--chart-6)`,
   `var(--font-sans)`, and `var(--font-mono)`. BB supplies its current theme live.
4. Preview with existing BB browser tools and inspect interactions and a narrow
   viewport. Follow the installed browser skill. If preview is unavailable, say so.
5. Publish with `t3_html_render({html, title, height, pin})`, or write the page
   into the workspace and run:

   ```bash
   bb t3-visualizations render chart.html --title "Model usage" --height 640
   ```

6. Emit the returned `::inline-vis{source="thread-storage" ...}` directive as its own block in the reply.
   Use `pin: true` or `--pin` only when the user asks to keep it above the composer
   and the optional Pinned Widgets plugin is installed. An unavailable pin leaves
   the inline visualization working.

Heights are 120–1200 pixels, default 640. Artifacts use this thread's storage on its host. New tools require a provider
session restart; the CLI works immediately.
