import { expectType } from "tsd";
import { request } from "./index.js";

import "@octokit-next/types-rest-api-ghes-3.1";

export async function test() {
  // known route, uses explicit version
  const ghesOnlyResponse = await request("GET /ghes-only", {
    request: {
      version: "ghes-3.1",
    },
  });
  expectType<boolean>(ghesOnlyResponse.data.ok);

  // known route, uses "github.com" types by default
  const rootEndpointResponse = await request("GET /");

  expectType<number>(rootEndpointResponse.status);
  expectType<string>(rootEndpointResponse.url);
  expectType<string>(rootEndpointResponse.headers["x-ratelimit-limit"]);
  expectType<string>(rootEndpointResponse.data.emojis_url);

  // unknown route
  const unknownResponse = await request("GET /unknown");
  expectType<number>(unknownResponse.status);
  expectType<string>(unknownResponse.url);
  expectType<unknown>(unknownResponse.headers["x-ratelimit-limit"]);
  expectType<unknown>(unknownResponse.data);
}
