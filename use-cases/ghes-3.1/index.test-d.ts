import { expectType } from "tsd";
import { Octokit } from "./index.js";

export async function test() {
  const octokit = new Octokit({
    version: "ghes-3.1",
    baseUrl: "https://github.acme-inc.com/api/v3",
  });
  const rootEndpointResponse = await octokit.request("GET /");
  expectType<number>(rootEndpointResponse.status);
  expectType<string>(rootEndpointResponse.url);
  expectType<string>(
    rootEndpointResponse.headers["x-github-enterprise-version"]
  );
  expectType<string>(rootEndpointResponse.data.emojis_url);

  // @ts-expect-error - `GET /dotcom-only` does not exist on GHES
  await octokit.request("GET /dotcom-only");

  const ghesOnlyResponse = await octokit.request("GET /ghes-only");
  expectType<boolean>(ghesOnlyResponse.data.ok);
}
