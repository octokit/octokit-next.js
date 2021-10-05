import { expectType } from "tsd";

import { OctokitGhes32 } from "./index.js";

export async function test() {
  new OctokitGhes32({});

  const octokit = new OctokitGhes32({
    baseUrl: "https://github.acme-inc.com/api/v3",
  });

  const rootResponse = await octokit.request("GET /");
  expectType<string>(rootResponse.data.emojis_url);

  // TODO: make changed properties work (#28)
  // // The `api` key was removed for GHES versions, but
  // // the `installed_version` key was added.
  // const metaResponse = await octokit.request("GET /meta");
  // expectType<string>(metaResponse.data.installed_version);
  // expectType<never>(metaResponse.data.api);

  // @ts-expect-error - `GET /marketplace_listing/plans` only exists on `github.com`
  await octokit.request("GET /marketplace_listing/plans");

  // `GET /repos/{owner}/{repo}/branches/{branch}/rename` was added in GHES 3.1
  await octokit.request("POST /repos/{owner}/{repo}/branches/{branch}/rename", {
    owner: "",
    repo: "",
    branch: "",
    new_name: "",
  });

  // PATCH /admin/organizations/{org} was added in GHES 3.2
  const response = await octokit.request("PATCH /admin/organizations/{org}", {
    org: "",
    login: "",
  });
  expectType<string | undefined>(response.data.url);

  expectType<string>(rootResponse.headers["x-github-enterprise-version"]);
}
