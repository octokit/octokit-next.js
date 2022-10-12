import { expectType, expectNotType } from "tsd";

import { Octokit } from "@octokit-next/core";

import "@octokit-next/types-rest-api-github.ae";

export async function test() {
  const octokit = new Octokit({
    version: "github.ae",
  });

  // @ts-expect-error - `GET /marketplace_listing/plans` exists only on `github.com`
  await octokit.request("GET /marketplace_listing/plans");

  const getHookResponse = await octokit.request("GET /admin/hooks/{hook_id}", {
    hook_id: 1,
  });
  expectType<number | undefined>(getHookResponse.data.id);
  expectType<string>(getHookResponse.headers["x-github-enterprise-version"]);

  const dotcomOnlyResponse2 = await octokit.request(
    "GET /marketplace_listing/plans",
    {
      request: {
        version: "github.com",
      },
    }
  );
  expectType<number>(dotcomOnlyResponse2.data[0].id);
}
