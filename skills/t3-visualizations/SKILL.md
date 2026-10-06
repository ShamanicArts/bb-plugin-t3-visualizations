---
name: t3-visualizations
description: Create T3-style interactive visual replies in BB using the existing inline widget and pinned widget infrastructure.
---

Use when a chart, interactive diagram, table, collage, or small simulation
communicates more clearly than prose.

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

6. Emit the returned `::widget{...}` directive as its own block in the reply.
   Pinned Widgets provides resize, expand, and **Pin to bar** on the same page.
   Use `pin: true` or `--pin` when the user asks to keep it above the composer.

Heights are 120–1200 pixels, default 640. Existing widgets remember user
resizing. Artifacts use this thread's storage on its host. Pinned Widgets must
be enabled. New tools require a provider session restart; the CLI works immediately.
