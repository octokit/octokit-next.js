import { expectType } from "tsd";

import { OctokitCore } from "./index.js";

export async function test() {
  new OctokitCore({});

  const octokit = new OctokitCore();

  const rootResponse = await octokit.request("GET /");
  expectType<string>(rootResponse.data.emojis_url);

  const emojisResponse = await octokit.request("GET /emojis");
  expectType<unknown>(emojisResponse.data);
}
