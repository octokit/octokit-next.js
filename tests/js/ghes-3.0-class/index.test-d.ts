import { expectType, expectNotType } from "tsd";

import { OctokitGhes30 } from "./index.js";

export async function test() {
  new OctokitGhes30({});

  const octokit = new OctokitGhes30({
    baseUrl: "https://github.acme-inc.com/api/v3",
  });

  const rootResponse = await octokit.request("GET /");
  expectType<string>(rootResponse.data.emojis_url);
  expectType<string>(rootResponse.headers["x-github-enterprise-version"]);

  // `GET /orgs/{org}/audit-log` was added in GHES 3.1 and does not exist in GHES 3.0
  expectType<never>(await octokit.request("GET /orgs/{org}/audit-log"));

  // `GET /feeds`: the `security_advisories_url` was added in GHES 3.1 and does not exist in GHES 3.0
  const feedsResponse = await octokit.request("GET /feeds");
  expectType<never>(feedsResponse.data.security_advisories_url);
}
