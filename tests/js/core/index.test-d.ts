import { expectType } from "tsd";

import { Octokit, OctokitPlugin } from "@octokit-next/core";

export async function test() {
  const octokit = new Octokit();

  // @ts-expect-error - unknown properties cannot be used
  octokit.unknown;

  expectType<OctokitPlugin[]>(Octokit.PLUGINS);

  const unknownResponse = await octokit.request("GET /");
  expectType<number>(unknownResponse.status);
  expectType<string>(unknownResponse.url);
  expectType<unknown>(unknownResponse.data);
  expectType<Octokit.ResponseHeaders>(unknownResponse.headers);

  const OctokitWithEmptyDefaults = Octokit.withDefaults({
    // there should be no required options
  });

  // instances of subclasses retain Octokit's methods
  const OctokitWithDefaultsAndPlugins = OctokitWithEmptyDefaults.withPlugins([
    () => {},
  ]);
  const octokitWithDefaultsAndPlugins = new OctokitWithDefaultsAndPlugins();

  const unknownResponse2 = await octokitWithDefaultsAndPlugins.request("GET /");
  expectType<number>(unknownResponse2.status);
}
