import { expectType } from "tsd";

import { Octokit } from "@octokit-next/core";

import "@octokit-next/types-rest-api-ghes-3.0-compatible";

export async function test() {
  const octokit = new Octokit({
    version: "ghes-3.0-compatible",
  });

  const response = await octokit.request("GET /");
  expectType<{
    emojis_url: string;
  }>(response.data);
  expectType<
    Omit<
      Octokit.ResponseHeaders,
      "x-github-enterprise-version" | "x-dotcom-only"
    >
  >(response.headers);

  expectType<unknown>((await octokit.request("GET /dotcom-only")).data);
  expectType<unknown>((await octokit.request("GET /ghes-only")).data);
  expectType<unknown>((await octokit.request("GET /new-endpoint")).data);

  const dotcomOnlyResponse = await octokit.request("GET /dotcom-only", {
    request: {
      version: "github.com",
    },
  });
  expectType<boolean>(dotcomOnlyResponse.data.ok);
  const ghesOnlyResponse = await octokit.request("GET /ghes-only", {
    request: {
      version: "ghes-3.0",
    },
  });
  expectType<boolean>(ghesOnlyResponse.data.ok);
}
