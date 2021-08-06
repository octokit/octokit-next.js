import { expectType } from "tsd";
import { OctokitGhes31 } from "./index.js";
import { Octokit } from "../../index.js";

import "../../api-versions-types/ghes-3.1";

type Funk = Octokit.ApiVersions["ghes-3.1"];

export async function test() {
  const octokit = new OctokitGhes31({
    version: "ghes-3.1",
    baseUrl: "https://github.acme-inc.com/api/v3",
  });

  const emojisResponseGhes31 = await octokit.request("GET /emojis");
  expectType<string>(emojisResponseGhes31.data["+1"]);
  expectType<string>(emojisResponseGhes31.data["-1"]);
  expectType<string>(emojisResponseGhes31.data["ghes-only"]);

  expectType<never>(emojisResponseGhes31.data["dotcom-only"]);

  await octokit.request("GET /dotcom-only");
}
