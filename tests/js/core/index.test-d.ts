import { expectType } from "tsd";

import { Octokit, Plugin } from "@octokit-next/core";

export async function test() {
  const octokit = new Octokit();

  // @ts-expect-error - unknown properties cannot be used
  octokit.unknown;

  expectType<Plugin[]>(Octokit.plugins);

  const rootResponse = await octokit.request("GET /");
  expectType<string>(rootResponse.data.emojis_url);

  const emojisResponse = await octokit.request("GET /emojis");
  expectType<unknown>(emojisResponse.data);

  const OctokitWithEmptyDefaults = Octokit.withDefaults({
    // there should be no required options
  });

  // instances of subclasses retain Octokit's methods
  const OctokitWithDefaultsAndPlugins = OctokitWithEmptyDefaults.withPlugins([
    () => {},
  ]);
  const octokitWithDefaultsAndPlugins = new OctokitWithDefaultsAndPlugins();

  const emojisResponse2 = octokitWithDefaultsAndPlugins.request("GET /");
  expectType<string>(rootResponse.data.emojis_url);
}
