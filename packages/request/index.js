import { endpoint } from "@octokit-next/endpoint";
import { getUserAgent } from "universal-user-agent";

import { VERSION } from "./lib/version.js";
export { VERSION } from "./lib/version.js";

import withDefaults from "./lib/with-defaults.js";

export const request = withDefaults(endpoint, {
  headers: {
    "user-agent": `octokit-next-request.js/${VERSION} ${getUserAgent()}`,
  },
});
