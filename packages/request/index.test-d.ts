import { expectType } from "tsd";
import { request } from "./index.js";

import "@octokit-next/types-rest-api-ghes-3.1";

export async function test() {
  const rootEndpointResponse = await request("GET /");

  expectType<number>(rootEndpointResponse.status);
  expectType<string>(rootEndpointResponse.url);
  expectType<string>(rootEndpointResponse.headers["x-ratelimit-limit"]);
  expectType<string>(rootEndpointResponse.data.emojis_url);

  const ghesOnlyResponse = await request("GET /ghes-only", {
    request: {
      version: "ghes-3.1",
    },
  });
  expectType<boolean>(ghesOnlyResponse.data.ok);
}
