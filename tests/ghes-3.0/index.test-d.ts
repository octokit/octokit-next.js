import { expectType, expectNotType } from "tsd";
import { OctokitGhes30 } from "./index.js";

export async function test() {
  const octokit = new OctokitGhes30({
    baseUrl: "https://github.acme-inc.com/api/v3",
  });

  const emojisResponseGhes30 = await octokit.request("GET /emojis");
  expectType<string>(emojisResponseGhes30.data["+1"]);
  expectType<string>(emojisResponseGhes30.data["-1"]);
  expectType<string>(emojisResponseGhes30.data["ghes-only"]);
  expectType<never>(emojisResponseGhes30.data["dotcom-only"]);

  expectType<never>(await octokit.request("GET /dotcom-only"));
  expectType<never>(await octokit.request("GET /new-endpoint"));

  const { headers } = await octokit.request("GET /emojis");
  expectType<string>(headers["x-github-enterprise-version"]);
  expectType<never>(headers["x-dotcom-only"]);

  expectNotType<never>(await octokit.request("GET /ghes-only"));
  expectType<never>(await octokit.request("GET /new-ghes-only"));
}
