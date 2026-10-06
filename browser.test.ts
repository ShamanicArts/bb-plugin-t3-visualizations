import { readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { chromium } from "playwright-core";
import { expect, it } from "vitest";
import { injectHtmlRenderBootstrap } from "./lib/htmlRender.ts";

// Exercise the same content script and opaque iframe in a real browser,
// without opening desktop windows or creating another preview service.
function browserModule(file: string): string {
  let source = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
  source = source.replace(/"(\.\/[^"]+\.ts)"/g, (_, relative: string) => JSON.stringify(browserModule(path.resolve(path.dirname(file), relative))));
  return `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
}

it("themes inline and pinned frames live, preserves interaction state, and cleans up on reload", async () => {
  const browser = await chromium.launch({ executablePath: process.env.T3_TEST_CHROMIUM ?? "/usr/bin/chromium", headless: true, chromiumSandbox: true });
  try {
    const page = await browser.newPage();
    await page.setContent('<html class="dark" style="color-scheme:dark;--foreground:#eeeeee;--background:#101010;--primary:#33aaff"><body></body></html>');
    await page.addScriptTag({ type: "module", content: `import { mountThemeBridge } from ${JSON.stringify(browserModule(path.join(import.meta.dirname, "lib/themeBridge.ts")))}; window.bridgeController = new AbortController(); window.stopBridge = mountThemeBridge({signal:window.bridgeController.signal}); window.startBridge = () => { window.bridgeController = new AbortController(); window.stopBridge = mountThemeBridge({signal:window.bridgeController.signal}); };` });
    await page.waitForFunction(() => "stopBridge" in window);
    const html = injectHtmlRenderBootstrap('<button onclick="this.textContent=\'Clicked\'">Click</button><script>try{parent.document.body;document.body.dataset.escaped="yes"}catch(e){document.body.dataset.escaped="no"}</script>');
    await page.evaluate((documentHtml) => {
      for (const title of ["inline widget", "pinned widget"]) {
        const frame = document.createElement("iframe");
        frame.title = title; frame.sandbox.add("allow-scripts"); frame.srcdoc = documentHtml;
        document.body.append(frame);
      }
    }, html);
    await expect.poll(async () => page.frames()[1]?.evaluate(() => getComputedStyle(document.documentElement).color)).toBe("rgb(238, 238, 238)");
    const inline = page.frames()[1]!;
    const pinned = page.frames()[2]!;
    await inline.getByRole("button").click();
    expect(await inline.locator("body").getAttribute("data-escaped")).toBe("no");
    await page.evaluate(() => {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
      document.documentElement.style.setProperty("--foreground", "#222222");
    });
    for (const frame of [inline, pinned]) {
      await expect.poll(() => frame.evaluate(() => getComputedStyle(document.documentElement).color)).toBe("rgb(34, 34, 34)");
    }
    expect(await inline.getByRole("button").textContent()).toBe("Clicked");
    await page.evaluate("window.bridgeController.abort(); window.startBridge()");
    await page.waitForTimeout(100);
    await page.evaluate(() => document.documentElement.style.setProperty("--foreground", "#123456"));
    await expect.poll(() => pinned.evaluate(() => getComputedStyle(document.documentElement).color)).toBe("rgb(18, 52, 86)");
    await page.evaluate("window.stopBridge()");
    await page.evaluate(() => document.documentElement.style.setProperty("--foreground", "#654321"));
    await page.waitForTimeout(100);
    expect(await pinned.evaluate(() => getComputedStyle(document.documentElement).color)).toBe("rgb(18, 52, 86)");
  } finally { await browser.close(); }
}, 20_000);
