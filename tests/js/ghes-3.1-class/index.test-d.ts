import { expectType, expectNotType } from "tsd";

import { OctokitGhes31 } from "./index.js";

export async function test() {
  new OctokitGhes31({});

  const octokit = new OctokitGhes31({
    baseUrl: "https://github.acme-inc.com/api/v3",
  });

  const rootResponse = await octokit.request("GET /");
  expectType<string>(rootResponse.data.emojis_url);

  // The `api` key was removed for GHES versions, but
  // the `installed_version` key was added.
  const metaResponse = await octokit.request("GET /meta");
  expectType<string>(metaResponse.data.installed_version);
  expectType<never>(metaResponse.data.api);

  expectType<never>(await octokit.request("GET /marketplace_listing/plans"));
  // `GET /repos/{owner}/{repo}/branches/{branch}/rename` was added in GHES 3.1
  expectNotType<never>(
    await octokit.request("GET /repos/{owner}/{repo}/branches/{branch}/rename")
  );

  expectType<string>(rootResponse.headers["x-github-enterprise-version"]);
}
