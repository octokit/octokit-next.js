import { expectType, expectNotType } from "tsd";

import { Octokit } from "@octokit-next/core";

import "@octokit-next/types-rest-api-ghes-3.1";

export async function test() {
  const octokit = new Octokit({
    version: "ghes-3.1",
  });

  const dotcomOnlyResponse = octokit.request("GET /marketplace_listing/plans");
  expectType<never>(dotcomOnlyResponse);

  const ghesOnlyResponse = await octokit.request("GET /admin/users");
  expectType<string>(ghesOnlyResponse.data[0].login);
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
}
