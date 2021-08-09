import { ExtendOctokitWith, Octokit } from "@octokit-next/core";

import { fooPlugin } from "./plugins/foo/index.js";
import { barPlugin } from "./plugins/bar/index.js";
import { voidPlugin } from "./plugins/void/index.js";
import { withOptionsPlugin } from "./plugins/with-options/index.js";

export const OctokitWithDefaultsAndPlugins: ExtendOctokitWith<
  Octokit,
  {
    plugins: [
      typeof fooPlugin,
      typeof barPlugin,
      typeof voidPlugin,
      typeof withOptionsPlugin
    ];
    defaults: {
      userAgent: "OctokitWithDefaultsAndPlugins/1.0.0";
    };
  }
>;

// support import to be used as a class instance type
export type OctokitWithDefaultsAndPlugins =
  typeof OctokitWithDefaultsAndPlugins;
