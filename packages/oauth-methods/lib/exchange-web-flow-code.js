// @ts-check

import { request as defaultRequest } from "@octokit-next/request";

import { oauthRequest, toTimestamp } from "./utils.js";

/**
 * @param {import('..').ExchangeWebFlowCodeOptions} options
 * @returns {Promise<import('..').ExchangeWebFlowCodeResponse>}
 */
export async function exchangeWebFlowCode(options) {
  const request = options.request /* c8 ignore next */ || defaultRequest;

  const response = await oauthRequest(
    request,
    "POST /login/oauth/access_token",
    {
      client_id: options.clientId,
      client_secret: options.clientSecret,
      code: options.code,
      redirect_uri: options.redirectUrl,
    }
  );

  const authentication = {
    clientType: options.clientType,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: response.data.access_token,
    scopes: response.data.scope.split(/\s+/).filter(Boolean),
  };

  if (options.clientType === "github-app") {
    if ("refresh_token" in response.data) {
      const apiTimeInMs = new Date(response.headers.date).getTime();

      authentication.refreshToken = response.data.refresh_token;
      authentication.expiresAt = toTimestamp(
        apiTimeInMs,
        response.data.expires_in
      );
      authentication.refreshTokenExpiresAt = toTimestamp(
        apiTimeInMs,
        response.data.refresh_token_expires_in
      );
    }

    delete authentication.scopes;
  }

  return { ...response, authentication };
}
