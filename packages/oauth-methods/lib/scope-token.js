// @ts-check

import { request as defaultRequest } from "@octokit-next/request";

/**
 * @param {import("..").ScopeTokenOptions} options
 * @returns {Promise<import("..").ScopeTokenResponse>}
 */
export async function scopeToken(options) {
  const {
    request: optionsRequest,
    clientType,
    clientId,
    clientSecret,
    token,
    ...requestOptions
  } = options;

  const request = optionsRequest /* c8 ignore next */ || defaultRequest;

  const response = await request(
    "POST /applications/{client_id}/token/scoped",

    {
      headers: {
        authorization: `basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      client_id: clientId,
      access_token: token,
      ...requestOptions,
    }
  );

  const authentication = Object.assign(
    {
      clientType,
      clientId,
      clientSecret,
      token: response.data.token,
    },
    response.data.expires_at ? { expiresAt: response.data.expires_at } : {}
  );

  return { ...response, authentication };
}
