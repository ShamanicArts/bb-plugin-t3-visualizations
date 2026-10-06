import { htmlRenderTheme, htmlRenderThemeMessage, HTML_RENDER_DEFAULT_FONTS, type HtmlRenderTheme } from "./htmlRender.ts";
import { T3_CODE_DARK_THEME_COLORS, T3_CODE_LIGHT_THEME_COLORS } from "./themePalettes.ts";

export function readBbTheme(): HtmlRenderTheme {
  const root = document.documentElement;
  const style = getComputedStyle(root);
  const appearance = root.classList.contains("dark") || style.colorScheme === "dark" ? "dark" : "light";
  const defaults = htmlRenderTheme(appearance === "dark" ? T3_CODE_DARK_THEME_COLORS : T3_CODE_LIGHT_THEME_COLORS, appearance);
  const variables = { ...defaults.variables };
  const probe = document.createElement("span");
  probe.style.display = "none";
  root.append(probe);
  try {
    for (const name of Object.keys(variables)) {
      const value = style.getPropertyValue(name).trim();
      if (!value) continue;
      if (name.startsWith("--font-") || name === "--radius") variables[name] = value;
      else {
        probe.style.color = `var(${name})`;
        variables[name] = getComputedStyle(probe).color;
      }
    }
  } finally { probe.remove(); }
  variables["--font-sans"] = style.getPropertyValue("--font-sans").trim() || style.fontFamily || HTML_RENDER_DEFAULT_FONTS.sans;
  return { appearance, variables };
}

export function mountThemeBridge({ signal }: { signal: AbortSignal }): () => void {
  const frames = new Set<HTMLIFrameElement>();
  let theme = readBbTheme();
  const send = (frame: HTMLIFrameElement) => frame.contentWindow?.postMessage(htmlRenderThemeMessage(theme), "*");
  const receive = (event: MessageEvent) => {
    if (event.data?.type !== "bb-t3-visualization-ready") return;
    const frame = Array.from(document.querySelectorAll("iframe")).find((item) => item.contentWindow === event.source);
    if (!frame || !frame.sandbox.contains("allow-scripts") || frame.sandbox.contains("allow-same-origin")) return;
    frames.add(frame);
    send(frame);
  };
  window.addEventListener("message", receive, { signal });
  const observer = new MutationObserver(() => {
    const next = readBbTheme();
    if (JSON.stringify(next) === JSON.stringify(theme)) return;
    theme = next;
    for (const frame of frames) { if (frame.isConnected) send(frame); else frames.delete(frame); }
  });
  observer.observe(document.documentElement, { attributes: true });
  if (document.body) observer.observe(document.body, { attributes: true });
  // Covers plugin reload while existing widgets are already mounted.
  for (const frame of Array.from(document.querySelectorAll("iframe"))) {
    if (frame.sandbox.contains("allow-scripts") && !frame.sandbox.contains("allow-same-origin")) frame.contentWindow?.postMessage({ type: "bb-t3-theme-request" }, "*");
  }
  const cleanup = () => { observer.disconnect(); window.removeEventListener("message", receive); frames.clear(); };
  signal.addEventListener("abort", cleanup, { once: true });
  return () => { signal.removeEventListener("abort", cleanup); cleanup(); };
}
