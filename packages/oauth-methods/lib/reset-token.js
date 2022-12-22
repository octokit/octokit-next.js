// @ts-check

import { request as defaultRequest } from "@octokit-next/request";

/**
 *
 * @param {import('..').ResetTokenOptions} options
 * @returns {Promise<import('..').ResetTokenResponse>}
 */
export async function resetToken(options) {
  const request = options.request /* c8 ignore next */ || defaultRequest;

  const auth = btoa(`${options.clientId}:${options.clientSecret}`);
  const response = await request(
    "PATCH /applications/{client_id}/token",

    {
      headers: {
        authorization: `basic ${auth}`,
      },
      client_id: options.clientId,
      access_token: options.token,
    }
  );

  const authentication = {
    clientType: options.clientType,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: response.data.token,
    scopes: response.data.scopes,
  };

  if (response.data.expires_at) {
    authentication.expiresAt = response.data.expires_at;
  }

  if (authentication.clientType === "github-app") {
    // @ts-expect-error
    delete authentication.scopes;
  }

  return {
    ...response,
    // @ts-expect-error - can be either github app or oauth app authentication
    authentication,
  };
}
