import { expectType } from "tsd";
import { request } from "./index.js";

import "@octokit-next/types-rest-api-ghes-3.2";

export async function test() {
  // known route, uses explicit version
  const ghesOnlyResponse = await request("GET /admin/hooks/{hook_id}", {
    hook_id: 1,
    request: {
      version: "ghes-3.2",
    },
  });
  expectType<number | undefined>(ghesOnlyResponse.data.id);

  // @ts-expect-error - `GET /marketplace_listing/plans` does not exist on GHES
  await request("GET /marketplace_listing/plans", {
    request: {
      version: "ghes-3.2",
    },
  });

  // known route, uses "github.com" types by default
  const rootEndpointResponse = await request("GET /");

  expectType<200>(rootEndpointResponse.status);
  expectType<string>(rootEndpointResponse.url);
  expectType<string>(rootEndpointResponse.headers["x-ratelimit-limit"]);
  expectType<string>(rootEndpointResponse.data.emojis_url);

  // @ts-expect-error - Unknown routes are not supported once types are imported
  await request("GET /unknown");
}
