import { expectType, expectNotType } from "tsd";
import { OctokitGhes31 } from "./index.js";

export async function test() {
  new OctokitGhes31({});

  const octokit = new OctokitGhes31({
    baseUrl: "https://github.acme-inc.com/api/v3",
  });

  const emojisResponseGhes31 = await octokit.request("GET /emojis");
  expectType<string>(emojisResponseGhes31.data["+1"]);
  expectType<string>(emojisResponseGhes31.data["-1"]);
  expectType<string>(emojisResponseGhes31.data["ghes-only"]);
  expectType<never>(emojisResponseGhes31.data["dotcom-only"]);

  expectType<never>(await octokit.request("GET /dotcom-only"));
  expectNotType<never>(await octokit.request("GET /new-endpoint"));

  const { headers } = await octokit.request("GET /emojis");
  expectType<string>(headers["x-github-enterprise-version"]);
  expectType<never>(headers["x-dotcom-only"]);

  expectNotType<never>(await octokit.request("GET /ghes-only"));
  expectNotType<never>(await octokit.request("GET /new-ghes-only"));
}
