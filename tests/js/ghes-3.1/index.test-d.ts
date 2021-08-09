import { expectType, expectNotType } from "tsd";

import { Octokit } from "@octokit-next/core";

import "@octokit-next/types-rest-api-ghes-3.1";

export async function test() {
  const octokit = new Octokit({
    version: "ghes-3.1",
  });

  const dotcomOnlyResponse = await octokit.request("GET /dotcom-only");
  expectType<never>(dotcomOnlyResponse);

  const ghesOnlyResponse = await octokit.request("GET /ghes-only");
  expectType<boolean>(ghesOnlyResponse.data.ok);
  expectType<never>(ghesOnlyResponse.headers["x-dotcom-only"]);
}
