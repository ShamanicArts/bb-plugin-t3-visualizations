import { definePluginApp } from "@get-bb/plugin-sdk/app";
import { mountThemeBridge } from "./lib/themeBridge.ts";

export default definePluginApp((app) => {
  // Pinned Widgets owns rendering, sizing, pinning, and previews.
  app.contentScripts.register({ id: "visualization-theme", mount: mountThemeBridge });
});
