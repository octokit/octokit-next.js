import { request } from "@octokit-next/request";

import "@octokit-next/types-rest-api-ghes-3.1";

function expectType<T>(value: T): void {}

export async function test() {
  const rootEndpointResponse = await request("GET /");

  expectType<number>(rootEndpointResponse.status);
  expectType<string>(rootEndpointResponse.url);
  expectType<string>(rootEndpointResponse.headers["x-ratelimit-limit"]);
  expectType<string>(rootEndpointResponse.data.emojis_url);

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
}
