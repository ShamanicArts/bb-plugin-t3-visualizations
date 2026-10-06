import { definePluginApp } from "@get-bb/plugin-sdk/app";
import { mountThemeBridge } from "./lib/themeBridge.ts";

export default definePluginApp((app) => {
  // The separately installed Pinned Widgets plugin owns its widget controls and previews.
  app.contentScripts.register({ id: "visualization-theme", mount: mountThemeBridge });
});
