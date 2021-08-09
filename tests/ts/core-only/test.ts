import { Octokit } from "@octokit-next/core";

function expectType<T>(value: T): void {}

export async function test() {
  const octokit = new Octokit({
    version: "github.com",
  });

  const rootResponse = await octokit.request("GET /");
  expectType<string>(rootResponse.data.emojis_url);

  const dotcomOnlyResponse = await octokit.request("GET /dotcom-only");
  // @ts-expect-error - dotcomOnlyResponse.data is unknown
  dotcomOnlyResponse.data.ok;
}
