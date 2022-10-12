import { expectType } from "tsd";

import { Octokit } from "@octokit-next/core";

import "@octokit-next/types-rest-api-ghes-3.2-compatible";

export async function test() {
  const octokit = new Octokit({
    version: "ghes-3.2-compatible",
  });

  const response = await octokit.request("GET /");
  expectType<string>(response.data.emojis_url);
  expectType<Omit<Octokit.ResponseHeaders, "x-github-enterprise-version">>(
    response.headers
  );

  // `GET /repos/{owner}/{repo}/environments` was added in GHES 3.2
  const newEndpointResponse = await octokit.request(
    "GET /repos/{owner}/{repo}/environments",
    {
      owner: "",
      repo: "",
    }
  );
  expectType<number | undefined>(newEndpointResponse.data.total_count);

  // @ts-expect-error - GET /marketplace_listing/plans only exists on github.com
  await octokit.request("GET /marketplace_listing/plans");

  // with versions set explicitly
  const dotcomOnlyResponse = await octokit.request(
    "GET /marketplace_listing/plans",
    {
      request: {
        version: "github.com",
      },
    }
  );
  expectType<number>(dotcomOnlyResponse.data[0].id);

  // @ts-expect-error - GET /admin/hooks/{hook_id} only exists on GHES
  await octokit.request("GET /admin/hooks/{hook_id}", {
    hook_id: 1,
  });

  const ghesOnlyResponse = await octokit.request("GET /admin/hooks/{hook_id}", {
    hook_id: 1,
    request: {
      version: "ghes-3.2",
    },
  });
  expectType<number | undefined>(ghesOnlyResponse.data.id);
}
