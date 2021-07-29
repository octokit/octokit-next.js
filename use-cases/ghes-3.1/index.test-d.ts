import { expectType } from "tsd";
import { Octokit } from "./index.js";

import "../../api-versions-types/ghes-3.1";

export async function test() {
  const octokit = new Octokit({
    version: "ghes-3.1",
    baseUrl: "https://github.acme-inc.com/api/v3",
  });

  const emojisResponseGhes31 = await octokit.request("GET /emojis");
  expectType<string>(emojisResponseGhes31.data["+1"]);
  expectType<string>(emojisResponseGhes31.data["-1"]);
  expectType<string>(emojisResponseGhes31.data["ghes-only"]);

  // @ts-expect-error - ghes-only does not exist
  expectType<string>(emojisResponseGhes31.data["dotcom-only"]);
}
