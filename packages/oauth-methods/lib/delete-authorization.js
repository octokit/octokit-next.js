// @ts-check

import { request as defaultRequest } from "@octokit-next/request";

/**
 * @param {import('..').DeleteAuthorizationOptions} options
 * @returns {Promise<import('..').DeleteAuthorizationResponse>}
 */
export async function deleteAuthorization(options) {
  const request = options.request /* c8 ignore next */ || defaultRequest;

  const auth = btoa(`${options.clientId}:${options.clientSecret}`);

  return request(
    "DELETE /applications/{client_id}/grant",

    {
      headers: {
        authorization: `basic ${auth}`,
      },
      client_id: options.clientId,
      access_token: options.token,
    }
  );
}
