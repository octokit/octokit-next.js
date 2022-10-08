import { request } from "@octokit-next/request";
import { getUserAgent } from "universal-user-agent";

import { VERSION } from "./lib/version.js";
export { VERSION } from "./lib/version.js";

import { withDefaults } from "./lib/with-defaults.js";

export const graphql = withDefaults(request, {
  headers: {
    "user-agent": `octokit-next-graphql.js/${VERSION} ${getUserAgent()}`,
  },
  method: "POST",
  url: "/graphql",
});

export { GraphqlResponseError } from "./lib/error.js";

export function withCustomRequest(customRequest) {
  return withDefaults(customRequest, {
    method: "POST",
    url: "/graphql",
  });
}
