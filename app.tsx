import { definePluginApp } from "@get-bb/plugin-sdk/app";
import { mountThemeBridge } from "./lib/themeBridge.ts";

export default definePluginApp((app) => {
  // Theme BB's existing sandboxed previews, with or without optional pinning plugins.
  app.contentScripts.register({ id: "visualization-theme", mount: mountThemeBridge });
});
