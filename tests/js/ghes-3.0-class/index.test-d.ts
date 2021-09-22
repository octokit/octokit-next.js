import { expectType } from "tsd";

import { OctokitGhes30 } from "./index.js";

export async function test() {
  new OctokitGhes30({});

  const octokit = new OctokitGhes30({
    baseUrl: "https://github.acme-inc.com/api/v3",
  });

  const rootResponse = await octokit.request("GET /");
  expectType<string>(rootResponse.data.emojis_url);

  expectType<string>(rootResponse.headers["x-github-enterprise-version"]);

  // @ ts-expect-error - `GET /orgs/{org}/audit-log` was added in GHES 3.1 and does not exist in GHES 3.0

  await octokit.request("GET /orgs/{org}/audit-log", {
    org: "octokit",
  });

  const response = await octokit.request("GET /orgs/{org}/audit-log", {
    org: "octokit",
    request: {
      version: "ghes-3.1",
    },
  });

  // TODO: make changed properties work (#28)
  // // `GET /feeds`: the `security_advisories_url` was added in GHES 3.1 and does not exist in GHES 3.0
  // const feedsResponse = await octokit.request("GET /feeds");
  // expectType<never>(feedsResponse.data.security_advisories_url);
}
