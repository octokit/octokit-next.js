import { Octokit } from "@octokit-next/core";

import { fooPlugin } from "./plugins/foo";
import { barPlugin } from "./plugins/bar";
import { voidPlugin } from "./plugins/void";
import { withOptionsPlugin } from "./plugins/with-options";

export const OctokitWithDefaultsAndPlugins = Octokit.withPlugins([
  fooPlugin,
  barPlugin,
  voidPlugin,
  withOptionsPlugin,
]).withDefaults({
  userAgent: "OctokitWithDefaultsAndPlugins/1.0.0",
});
