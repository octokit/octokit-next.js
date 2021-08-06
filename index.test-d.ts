import { expectType } from "tsd";
import { Octokit, Plugin } from "./index.js";

export async function test() {
  // TODO:
  // new Octokit();

  const octokit = new Octokit({
    version: "github.com",
  });

  // @ts-expect-error - unknown properties cannot be used
  octokit.unknown;

  const OctokitWithEmptyDefaults = Octokit.withDefaults({
    // there should be no required options
  });

  new OctokitWithEmptyDefaults();

  expectType<Plugin[]>(Octokit.plugins);

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
  emojisResponseDotcom.data["ghes-only"];
}
