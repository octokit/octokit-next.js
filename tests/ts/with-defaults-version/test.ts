import { Octokit } from "@octokit-next/core";

import "@octokit-next/types-rest-api-ghes-3.2";

function expectType<T>(value: T): void {}

export async function test() {
  const octokit = new Octokit({
    version: "ghes-3.2",
  });
  expectType<"ghes-3.2">(octokit.options.version);

  const response = await octokit.request("GET /admin/hooks/{hook_id}", {
    hook_id: 1,
  });

  expectType<number | undefined>(response.data.id);

  // @ts-expect-error - `GET /marketplace_listing/plans` only exists on `github.com`
  await octokit.request("GET /marketplace_listing/plans");
}
