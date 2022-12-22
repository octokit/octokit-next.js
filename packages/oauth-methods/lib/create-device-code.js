// @ts-check

import { request as defaultRequest } from "@octokit-next/request";

import { oauthRequest } from "./utils.js";

/**
 * @param {import('..').CreateDeviceCodeOptions} options
 * @returns {Promise<import('..').CreateDeviceCodeDeviceTokenResponse>}
 */
export async function createDeviceCode(options) {
  const request = options.request /* c8 ignore next */ || defaultRequest;

  const parameters = {
    client_id: options.clientId,
  };

  if ("scopes" in options && Array.isArray(options.scopes)) {
    parameters.scope = options.scopes.join(" ");
  }

  return oauthRequest(request, "POST /login/device/code", parameters);
}
