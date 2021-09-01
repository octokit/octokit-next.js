import { Octokit } from "@octokit-next/core";

import "@octokit-next/types-rest-api";

function expectType<T>(value: T): void {}

export async function test() {
  const octokit = new Octokit({
    version: "github.com",
  });

  const dotcomOnlyResponse = await octokit.request(
    "GET /marketplace_listing/plans"
  );
  expectType<number>(dotcomOnlyResponse.data[0].id);
}
