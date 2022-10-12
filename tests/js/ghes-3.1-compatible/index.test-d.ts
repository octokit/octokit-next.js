import { expectType } from "tsd";

import { Octokit } from "@octokit-next/core";

import "@octokit-next/types-rest-api-ghes-3.1-compatible";

export async function test() {
  const octokit = new Octokit({
    version: "ghes-3.1-compatible",
  });

  const response = await octokit.request("GET /");
  expectType<string>(response.data.emojis_url);
  expectType<Omit<Octokit.ResponseHeaders, "x-github-enterprise-version">>(
    response.headers
  );

  // `/repos/{owner}/{repo}/branches/{branch}/rename` was added in GHES 3.1
  const newEndpointResponse = await octokit.request(
    "POST /repos/{owner}/{repo}/branches/{branch}/rename",
    {
      owner: "",
      repo: "",
      branch: "",
      new_name: "",
    }
  );
  expectType<string>(newEndpointResponse.data.name);

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
      version: "ghes-3.1",
    },
  });
  expectType<number | undefined>(ghesOnlyResponse.data.id);
}
