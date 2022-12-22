// @ts-check

import { RequestError } from "@octokit-next/request-error";

/**
 * @param {import("@octokit-next/types").RequestInterface} request
 * @returns string
 */
export function requestToOAuthBaseUrl(request) {
  const endpointDefaults = request.endpoint.DEFAULTS;
  return /^https:\/\/(api\.)?github\.com$/.test(endpointDefaults.baseUrl)
    ? "https://github.com"
    : endpointDefaults.baseUrl.replace("/api/v3", "");
}

/**
 * @param {import("@octokit-next/types").RequestInterface} request
 * @param {any} route
 * @param {Record<string, unknown>} parameters
 * @returns {Promise<import("@octokit-next/types").Octokit.Response<any>>}
 */
export async function oauthRequest(request, route, parameters) {
  const withOAuthParameters = {
    baseUrl: requestToOAuthBaseUrl(request),
    headers: {
      accept: "application/json",
    },
    ...parameters,
  };

  const response = await request(route, withOAuthParameters);

  const { error, error_description, error_uri } = response.data;

  if (error) {
    const requestError = new RequestError(
      `${error_description} (${error}, ${error_uri})`,
      400,
      {
        request: request.endpoint.merge(route, withOAuthParameters),
        response,
      }
    );

    throw requestError;
  }

  return response;
}

/**
 * @param {number} apiTimeInMs
 * @param {number} expirationInSeconds
 * @returns {string}
 */
export function toTimestamp(apiTimeInMs, expirationInSeconds) {
  return new Date(apiTimeInMs + expirationInSeconds * 1000).toISOString();
}
