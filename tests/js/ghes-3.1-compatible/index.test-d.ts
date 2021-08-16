import { expectType } from "tsd";

import { Octokit } from "@octokit-next/core";

import "@octokit-next/types-rest-api-ghes-3.1-compatible";

export async function test() {
  const octokit = new Octokit({
    version: "ghes-3.1-compatible",
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

  const newEndpointResponse = await octokit.request("GET /new-endpoint");
  expectType<{ ok: boolean }>(newEndpointResponse.data);

  expectType<unknown>((await octokit.request("GET /dotcom-only")).data);
  expectType<unknown>((await octokit.request("GET /ghes-only")).data);

  const dotcomOnlyResponse = await octokit.request("GET /dotcom-only", {
    request: {
      version: "github.com",
    },
  });
  expectType<boolean>(dotcomOnlyResponse.data.ok);
  const ghesOnlyResponse = await octokit.request("GET /ghes-only", {
    request: {
      version: "ghes-3.1",
    },
  });
  expectType<boolean>(ghesOnlyResponse.data.ok);
}
