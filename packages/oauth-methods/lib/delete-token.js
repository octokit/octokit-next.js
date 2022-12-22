// @ts-check

import { request as defaultRequest } from "@octokit-next/request";

/**
 * @param {import('..').DeleteTokenOptions} options
 * @returns {Promise<import('..').DeleteTokenResponse>}
 */
export async function deleteToken(options) {
  const request = options.request /* c8 ignore next */ || defaultRequest;

  const auth = btoa(`${options.clientId}:${options.clientSecret}`);

  return request(
    "DELETE /applications/{client_id}/token",

    {
      headers: {
        authorization: `basic ${auth}`,
      },
      client_id: options.clientId,
      access_token: options.token,
    }
  );
}
