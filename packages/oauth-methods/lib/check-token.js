// @ts-check

import { request as defaultRequest } from "@octokit-next/request";

/**
 * @param {import("..").CheckTokenOptions} options
 * @returns {Promise<import("..").CheckTokenResponse>}
 */
export async function checkToken(options) {
  const request = options.request /* c8 ignore next */ || defaultRequest;

  const response = await request("POST /applications/{client_id}/token", {
    headers: {
      authorization: `basic ${btoa(
        `${options.clientId}:${options.clientSecret}`
      )}`,
    },
    client_id: options.clientId,
    access_token: options.token,
  });

  const authentication = {
    clientType: options.clientType,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: options.token,
    scopes: response.data.scopes,
  };

  if (response.data.expires_at)
    authentication.expiresAt = response.data.expires_at;

  if (options.clientType === "github-app") {
    // @ts-expect-error
    delete authentication.scopes;
  }

  return {
    ...response,
    // @ts-expect-error
    authentication,
  };
}
