import { expectType } from "tsd";

import { Octokit } from "./index.js";

export async function test() {
  const octokit = new Octokit();

  const rootResponse = await octokit.request("GET /");
  expectType<string>(rootResponse.data.emojis_url);

  const emojisResponse = await octokit.request("GET /emojis");
  expectType<unknown>(emojisResponse.data);
}
