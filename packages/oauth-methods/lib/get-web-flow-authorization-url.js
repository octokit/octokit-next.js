// @ts-check

import { oauthAuthorizationUrl } from "@octokit-next/oauth-authorization-url";
import { request as defaultRequest } from "@octokit-next/request";

import { requestToOAuthBaseUrl } from "./utils.js";

/**
 *
 * @param {import("..").GetWebFlowAuthorizationUrlOptions} options
 * @returns {import("..").GetWebFlowAuthorizationUrlResult}
 */
export function getWebFlowAuthorizationUrl({
  request = defaultRequest,
  ...options
}) {
  const baseUrl = requestToOAuthBaseUrl(request);

  // @ts-expect-error - TypeScript cannot handle the oauth-app / github app differences
  return oauthAuthorizationUrl({ ...options, baseUrl });
}
