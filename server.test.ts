import { afterEach, describe, expect, it } from "vitest";
import { createFakePluginHost, experimental_scanPublicSdkOnly } from "@get-bb/plugin-sdk/testing";
import plugin from "./server.ts";

const hosts: ReturnType<typeof createFakePluginHost>["harness"][] = [];
afterEach(async () => { for (const host of hosts.splice(0)) await host.lifecycle.dispose(); });

function host(pinFails = false) {
  const { bb, harness } = createFakePluginHost({ pluginId: "t3-visualizations", sdk: {
    threads: { storageLocation: async () => ({ hostId: "remote-host", storageRootPath: "/remote/thread-storage" }) },
    files: { write: async () => ({}) },
    plugins: { callRpc: async () => { if (pinFails) throw new Error("Pinned Widgets disabled"); return { id: "chart" }; } },
  } });
  hosts.push(harness);
  plugin(bb);
  return harness;
}

describe("BB widget integration", () => {
  it("publishes through BB inline-vis when Pinned Widgets is absent, without contacting it", async () => {
    const harness = host(true);
    const result = await harness.behavior.callAgentTool("t3_html_render", { html: "<p>interactive chart</p>", title: "Chart" }, { threadId: "thread-1" });
    expect(result).toContain('::inline-vis{source="thread-storage" file="visualizations/t3-');
    expect(result).toContain('height="640"}');
    expect(result).not.toContain('::widget');
    const writes = harness.inspection.sdk.callsTo("files.write");
    expect(writes).toHaveLength(1);
    expect(writes[0]![0]).toMatchObject({ hostId: "remote-host", rootPath: "/remote/thread-storage", createParents: true });
    expect(JSON.stringify(writes[0])).toContain("bb-t3-visualization-ready");
    expect(harness.inspection.sdk.callsTo("plugins.callRpc")).toHaveLength(0);
  });
  it("pins the very same thread-storage file through the existing public pin RPC", async () => {
    const harness = host();
    const result = await harness.behavior.callAgentTool("t3_html_render", { html: "<p>Chart</p>", title: "Chart", pin: true }, { threadId: "thread-1" });
    expect(result).toContain("Pinned above the composer");
    const call = harness.inspection.sdk.callsTo("plugins.callRpc")[0]!;
    expect(call[0]).toMatchObject({ pluginId: "pinned-widgets", method: "pins_put", input: { threadId: "thread-1", label: "Chart", pin: { kind: "artifact", title: "Chart" } } });
    const file = /file="([^"]+)"/.exec(String(result))![1];
    expect(JSON.stringify(call)).toContain(file);
  });
  it("keeps a working BB inline preview when optional pinning is unavailable", async () => {
    const result = await host(true).behavior.callAgentTool("t3_html_render", { html: "<p>Chart</p>", title: "Chart", pin: true });
    expect(result).toContain('::inline-vis{source="thread-storage"');
    expect(result).toContain("Published inline. Optional pinning unavailable: Pinned Widgets disabled");
    expect(result).not.toContain("Pinned above the composer.");
  });
  it("publishes from the CLI without Pinned Widgets", async () => {
    const harness = host(true);
    harness.inspection.sdk.stub("threads.get", async () => ({ environment: { path: "/workspace", hostId: "local-host" } }));
    harness.inspection.sdk.stub("files.read", async () => ({ content: "<button>Interactive</button>", contentEncoding: "utf8" }));
    const result = await harness.behavior.runCli(["render", "chart.html", "--title", "Chart"], { threadId: "thread-1", cwd: "/workspace" });
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('::inline-vis{source="thread-storage"');
    expect(harness.inspection.sdk.callsTo("plugins.callRpc")).toHaveLength(0);
  });
  it("rejects unsupported height before writing", async () => {
    const harness = host();
    await expect(harness.behavior.callAgentTool("t3_html_render", { html: "<p>Chart</p>", title: "Chart", height: 2001 })).rejects.toThrow();
    expect(harness.inspection.sdk.callsTo("files.write")).toHaveLength(0);
  });
  it("uses only public SDK imports", async () => {
    const result = await experimental_scanPublicSdkOnly(import.meta.dirname, { allow: [/^typescript$/, /^playwright-core$/] });
    expect(result.violations).toEqual([]);
    expect(result.privateDependencies).toEqual([]);
  });
});
