import { expectType } from "tsd";
import { Octokit } from "@octokit-next/core";

import "@octokit-next/types-rest-api-ghes-3.2";

export async function test() {
  const octokit = new Octokit({
    version: "ghes-3.2",
  });
  expectType<"ghes-3.2">(octokit.options.version);

  const response = await octokit.request("GET /admin/hooks/{hook_id}", {
    hook_id: 1,
  });
  expectType<number | undefined>(response.data.id);

  const OctokitGHES32 = Octokit.withDefaults({
    version: "ghes-3.2",
  });
  expectType<"ghes-3.2">(OctokitGHES32.DEFAULTS.version);
  const octokitGhes31 = new OctokitGHES32();
  expectType<"ghes-3.2">(octokitGhes31.options.version);

  // @ts-expect-error - `GET /marketplace_listing/plans` only exists on `github.com`
  await octokitGhes31.request("GET /marketplace_listing/plans");
}
