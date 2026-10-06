import { randomUUID } from "node:crypto";
import path from "node:path";
import { parseArgs } from "node:util";
import type { BbPluginApi } from "@get-bb/plugin-sdk";
import { z } from "zod";
import { injectHtmlRenderBootstrap, HTML_RENDER_THEME_GUIDE } from "./lib/htmlRender.ts";

export const renderSchema = z.object({
  html: z.string().min(1).max(512_000),
  title: z.string().trim().min(1).max(80),
  height: z.number().int().min(120).max(1200).default(640),
  pin: z.boolean().default(false),
});
export const renderInstructions =
  "Build self-contained interactive HTML with inline CSS/JavaScript. Preview using BB's existing browser tooling, then publish with t3_html_render or bb t3-visualizations render. Emit the returned ::widget directive as its own block in your reply. It uses Pinned Widgets' existing resize, expand, and Pin to bar controls. Prefer data URLs for local images, or remote HTTPS assets. Use a fluid width, no outer banner/card, fixed chart heights, and content-driven page height (avoid 100vh). Theme variables follow BB live. Pin only when the user asks to keep the visualization above the composer.";

export default function plugin(bb: BbPluginApi) {
  async function publish(threadId: string, input: z.infer<typeof renderSchema>, signal?: AbortSignal) {
    const storage = await bb.sdk.threads.storageLocation({ threadId });
    const file = `visualizations/t3-${randomUUID()}.html`;
    await bb.sdk.files.write({
      hostId: storage.hostId, rootPath: storage.storageRootPath,
      path: path.join(storage.storageRootPath, file),
      content: injectHtmlRenderBootstrap(input.html), createParents: true,
    });
    const directive = `::widget{file="${file}" label=${JSON.stringify(input.title)} height="${input.height}"}`;
    if (input.pin) {
      try {
        await bb.sdk.plugins.callRpc({
          pluginId: "pinned-widgets", method: "pins_put",
          input: { threadId, label: input.title, pin: { kind: "artifact", path: file, title: input.title } },
          outputSchema: z.object({ id: z.string() }).passthrough(), signal,
        });
      } catch (error) {
        return `${directive}\n\nPublished, but could not pin: ${error instanceof Error ? error.message : String(error)}. Use the widget's Pin to bar control to retry.`;
      }
    }
    return `${directive}\n\n${input.pin ? "Pinned above the composer. " : ""}Emit the directive as its own block in your reply.`;
  }
  bb.agents.registerTool({
    name: "t3_html_render",
    description: `Publish interactive HTML into BB's existing inline widget and optionally pin the same page above the composer. ${HTML_RENDER_THEME_GUIDE.replaceAll("T3", "BB")}`,
    instructions: renderInstructions, parameters: renderSchema,
    presentation: { label: { pending: "Publishing visualization", completed: "Published visualization" }, icon: { glyph: "ChartNoAxesCombined" } },
    execute: (input, ctx) => publish(ctx.threadId, input, ctx.signal),
  });
  bb.cli.register({
    name: "t3-visualizations", summary: "Publish themed HTML using BB inline widgets and pins",
    commands: [{ name: "render", summary: "Publish an HTML file from this thread's workspace", usage: "bb t3-visualizations render <file.html> --title <title> [--height 120-1200] [--pin]" }],
    async run(argv, ctx) {
      try {
        const { values, positionals } = parseArgs({ args: argv, allowPositionals: true, options: {
          title: { type: "string" }, height: { type: "string" }, pin: { type: "boolean", default: false },
        } });
        if (positionals.length !== 2 || positionals[0] !== "render") throw new Error("Usage: bb t3-visualizations render <file.html> --title <title> [--height 120-1200] [--pin]");
        if (!ctx.threadId) throw new Error("Run this command from a BB thread.");
        const thread = await bb.sdk.threads.get({ threadId: ctx.threadId, include: "environment" });
        if (!("environment" in thread) || !thread.environment?.path) throw new Error("This thread has no workspace.");
        const environment = thread.environment;
        const rootPath = environment.path!;
        const file = path.resolve(ctx.cwd ?? rootPath, positionals[1]!);
        if (!/\.html?$/i.test(file)) throw new Error("The file must end with .html or .htm.");
        const read = await bb.sdk.files.read({ hostId: environment.hostId, rootPath, path: file, signal: ctx.signal });
        if (read.contentEncoding !== "utf8") throw new Error("The HTML file must be UTF-8 text.");
        const input = renderSchema.parse({ html: read.content, title: values.title ?? path.basename(file), height: values.height === undefined ? undefined : Number(values.height), pin: values.pin });
        return { exitCode: 0, stdout: await publish(ctx.threadId, input, ctx.signal) };
      } catch (error) {
        return { exitCode: 1, stderr: error instanceof Error ? error.message : String(error) };
      }
    },
  });
}
