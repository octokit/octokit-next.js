import { request as defaultRequest } from "@octokit/request";
import { OctokitResponse, RequestInterface } from "@octokit/types";

import {
  OAuthAppAuthentication,
  GitHubAppAuthenticationWithExpirationEnabled,
  GitHubAppAuthenticationWithExpirationDisabled,
  GitHubAppAuthenticationWithRefreshToken,
  OAuthAppCreateTokenResponseData,
  GitHubAppCreateTokenResponseData,
  GitHubAppCreateTokenWithExpirationResponseData,
} from "./types";
import { oauthRequest } from "./utils";

export type ExchangeWebFlowCodeOAuthAppOptions = {
  clientType: "oauth-app";
  clientId: string;
  clientSecret: string;
  code: string;
  redirectUrl?: string;
  request?: RequestInterface;
};
export type ExchangeWebFlowCodeGitHubAppOptions = {
  clientType: "github-app";
  clientId: string;
  clientSecret: string;
  code: string;
  redirectUrl?: string;
  request?: RequestInterface;
};

export type ExchangeWebFlowCodeOAuthAppResponse =
  OctokitResponse<OAuthAppCreateTokenResponseData> & {
    authentication: OAuthAppAuthentication;
  };
export type ExchangeWebFlowCodeGitHubAppResponse = OctokitResponse<
  | GitHubAppCreateTokenResponseData
  | GitHubAppCreateTokenWithExpirationResponseData
> & {
  authentication:
    | GitHubAppAuthenticationWithExpirationEnabled
    | GitHubAppAuthenticationWithExpirationDisabled
    | GitHubAppAuthenticationWithRefreshToken;
};

/**
 * Exchange the code from GitHub's OAuth Web flow for OAuth Apps.
 */
export async function exchangeWebFlowCode(
  options: ExchangeWebFlowCodeOAuthAppOptions
): Promise<ExchangeWebFlowCodeOAuthAppResponse>;

/**
 * Exchange the code from GitHub's OAuth Web flow for GitHub Apps. Note that `scopes` are not supported by GitHub Apps.
 */
export async function exchangeWebFlowCode(
  options: ExchangeWebFlowCodeGitHubAppOptions
): Promise<ExchangeWebFlowCodeGitHubAppResponse>;

export async function exchangeWebFlowCode(
  options:
    | ExchangeWebFlowCodeOAuthAppOptions
    | ExchangeWebFlowCodeGitHubAppOptions
): Promise<any> {
  const request =
    options.request ||
    /* istanbul ignore next: we always pass a custom request in tests */
    defaultRequest;

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

  const authentication: Record<string, unknown> = {
    clientType: options.clientType,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: response.data.access_token,
    scopes: response.data.scope.split(/\s+/).filter(Boolean),
  };

  if (options.clientType === "github-app") {
    if ("refresh_token" in response.data) {
      const apiTimeInMs = new Date(response.headers.date as string).getTime();

      (authentication.refreshToken = response.data.refresh_token),
        (authentication.expiresAt = toTimestamp(
          apiTimeInMs,
          response.data.expires_in
        )),
        (authentication.refreshTokenExpiresAt = toTimestamp(
          apiTimeInMs,
          response.data.refresh_token_expires_in
        ));
    }

    delete authentication.scopes;
  }

  return { ...response, authentication };
}

function toTimestamp(apiTimeInMs: number, expirationInSeconds: number) {
  return new Date(apiTimeInMs + expirationInSeconds * 1000).toISOString();
}
