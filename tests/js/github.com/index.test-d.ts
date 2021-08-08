import { expectType } from "tsd";

import { OctokitAllEndpoints } from "./index.js";

export async function test() {
  new OctokitAllEndpoints({});

  const octokit = new OctokitAllEndpoints({
    baseUrl: "https://github.acme-inc.com/api/v3",
  });

  const emojisResponse = await octokit.request("GET /emojis");
  expectType<string>(emojisResponse.data["+1"]);
  expectType<string>(emojisResponse.data["-1"]);
  expectType<string>(emojisResponse.data["dotcom-only"]);
  expectType<string>(emojisResponse.headers["x-dotcom-only"]);
}
