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
  expectType<Omit<Octokit.ResponseHeaders, "x-github-enterprise-version">>(
    response.headers
  );

  // `/repos/{owner}/{repo}/branches/{branch}/rename` was added in GHES 3.1
  // and is not available in GHES 3.0.
  expectType<unknown>(
    (
      await octokit.request(
        "POST /repos/{owner}/{repo}/branches/{branch}/rename"
      )
    ).data
  );
  expectType<unknown>(
    (await octokit.request("GET /marketplace_listing/plans")).data
  );
  expectType<unknown>((await octokit.request("GET /admin/users")).data);

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

  const ghesOnlyResponse = await octokit.request("GET /admin/users", {
    request: {
      version: "ghes-3.0",
    },
  });
  expectType<string>(ghesOnlyResponse.data[0].login);
}
