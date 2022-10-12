import { expectType } from "tsd";

import { Octokit } from "@octokit-next/core";

import "@octokit-next/types-rest-api-ghes-3.2";

export async function test() {
  const octokit = new Octokit({
    version: "ghes-3.2",
  });

  // @ts-expect-error - `GET /marketplace_listing/plans` only exists for `github.com`
  await octokit.request("GET /marketplace_listing/plans");

  await octokit.request("GET /marketplace_listing/plans", {
    request: {
      version: "github.com",
    },
  });

  const ghesOnlyResponse = await octokit.request("GET /admin/hooks/{hook_id}", {
    hook_id: 1,
  });
  expectType<number | undefined>(ghesOnlyResponse.data.id);
  expectType<string>(ghesOnlyResponse.headers["x-github-enterprise-version"]);

  const dotcomOnlyResponse2 = await octokit.request(
    "GET /marketplace_listing/plans",
    {
      request: {
        version: "github.com",
      },
    }
  );
  expectType<number>(dotcomOnlyResponse2.data[0].id);

  // PATCH /admin/organizations/{org} was added in GHES 3.2
  await octokit.request("PATCH /admin/organizations/{org}", {
    org: "",
    login: "",
  });
}
