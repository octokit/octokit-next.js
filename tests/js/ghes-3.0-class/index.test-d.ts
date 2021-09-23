import { expectType } from "tsd";

import { OctokitGhes30 } from "./index.js";

export async function plugin(octokit: OctokitGhes30) {
  const rootResponse = await octokit.request("GET /");
  expectType<string>(rootResponse.data.emojis_url);
  expectType<string>(rootResponse.headers["x-github-enterprise-version"]);

  // @ts-expect-error - `GET /orgs/{org}/audit-log` was added in GHES 3.1 and does not exist in GHES 3.0
  octokit.request("GET /orgs/{org}/audit-log");

  expectType<"ghes-3.0">(octokit.options.version);
}

export async function test() {
  const octokit = new OctokitGhes30();
  expectType<"ghes-3.0">(octokit.options.version);

  const rootResponse = await octokit.request("GET /");
  expectType<string>(rootResponse.data.emojis_url);

  expectType<string>(rootResponse.headers["x-github-enterprise-version"]);

  // @ts-expect-error - `GET /orgs/{org}/audit-log` was added in GHES 3.1 and does not exist in GHES 3.0
  await octokit.request("GET /orgs/{org}/audit-log", {
    org: "octokit",
  });

  await octokit.request("GET /orgs/{org}/audit-log", {
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
