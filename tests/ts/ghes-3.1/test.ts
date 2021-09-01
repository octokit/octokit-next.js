import { Octokit } from "@octokit-next/core";

import "@octokit-next/types-rest-api-ghes-3.1";

function expectType<T>(value: T): void {}

export async function test() {
  const octokit = new Octokit({
    version: "ghes-3.1",
  });

  const dotcomOnlyResponse = await octokit.request(
    "GET /marketplace_listing/plans"
  );
  expectType<never>(dotcomOnlyResponse);

  const ghesOnlyResponse = await octokit.request("GET /admin/hooks/{hook_id}", {
    hook_id: 1,
    mediaType: {
      previews: ["superpro"],
    },
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
}
