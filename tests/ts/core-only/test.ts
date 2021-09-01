import { Octokit } from "@octokit-next/core";

function expectType<T>(value: T): void {}

export async function test() {
  const octokit = new Octokit({
    version: "github.com",
  });

  const rootResponse = await octokit.request("GET /");
  expectType<string>(rootResponse.data.emojis_url);

  const unknownResponse = await octokit.request("GET /unknown");
  // @ts-expect-error - unknownResponse.data is unknown
  unknownResponse.data.ok;
}
