import { expectType } from "tsd";
import { Octokit } from "./index.js";

export async function test() {
  const octokit = new Octokit({
    version: "github.com",
  });

  const rootEndpointResponse = await octokit.request("GET /");
  expectType<number>(rootEndpointResponse.status);
  expectType<string>(rootEndpointResponse.url);
  expectType<string>(rootEndpointResponse.headers["x-ratelimit-limit"]);
  expectType<string>(rootEndpointResponse.data.emojis_url);

  const emojisResponseDotcom = await octokit.request("GET /emojis");
  expectType<string>(emojisResponseDotcom.data["+1"]);
  expectType<string>(emojisResponseDotcom.data["-1"]);
  expectType<string>(emojisResponseDotcom.data["dotcom-only"]);

  // @ts-expect-error - ghes-only does not exist
  expectType<string>(emojisResponseDotcom.data["ghes-only"]);
}
