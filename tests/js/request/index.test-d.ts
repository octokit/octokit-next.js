import { expectType } from "tsd";
import { request } from "./index.js";

import "@octokit-next/types-rest-api-ghes-3.1";

export async function test() {
  // known route, uses explicit version
  const ghesOnlyResponse = await request("GET /admin/hooks/{hook_id}", {
    hook_id: 1,
    mediaType: {
      previews: ["superpro"],
    },
    request: {
      version: "ghes-3.1",
    },
  });
  expectType<number | undefined>(ghesOnlyResponse.data.id);

  // known route, but unsupported in given version
  const dotcomOnlyResponse = await request("GET /marketplace_listing/plans", {
    request: {
      version: "ghes-3.1",
    },
  });
  expectType<never>(dotcomOnlyResponse);

  // known route, uses "github.com" types by default
  const rootEndpointResponse = await request("GET /");

  expectType<200>(rootEndpointResponse.status);
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
