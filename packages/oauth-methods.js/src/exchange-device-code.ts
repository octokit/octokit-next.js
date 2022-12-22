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

export type ExchangeDeviceCodeOAuthAppOptionsWithoutClientSecret = {
  clientType: "oauth-app";
  clientId: string;
  code: string;
  redirectUrl?: string;
  state?: string;
  request?: RequestInterface;
  scopes?: string[];
};
export type ExchangeDeviceCodeOAuthAppOptions =
  ExchangeDeviceCodeOAuthAppOptionsWithoutClientSecret & {
    clientSecret: string;
  };
export type ExchangeDeviceCodeGitHubAppOptionsWithoutClientSecret = {
  clientType: "github-app";
  clientId: string;
  code: string;
  redirectUrl?: string;
  state?: string;
  request?: RequestInterface;
};

export type ExchangeDeviceCodeGitHubAppOptions =
  ExchangeDeviceCodeGitHubAppOptionsWithoutClientSecret & {
    clientSecret: string;
  };

type OAuthAppAuthenticationWithoutClientSecret = Omit<
  OAuthAppAuthentication,
  "clientSecret"
>;
type GitHubAppAuthenticationWithoutClientSecret = Omit<
  | GitHubAppAuthenticationWithExpirationEnabled
  | GitHubAppAuthenticationWithExpirationDisabled,
  "clientSecret"
>;
type GitHubAppAuthenticationWithExpirationWithoutClientSecret = Omit<
  GitHubAppAuthenticationWithRefreshToken,
  "clientSecret"
>;

export type ExchangeDeviceCodeOAuthAppResponse =
  OctokitResponse<OAuthAppCreateTokenResponseData> & {
    authentication: OAuthAppAuthentication;
  };

export type ExchangeDeviceCodeOAuthAppResponseWithoutClientSecret =
  OctokitResponse<OAuthAppCreateTokenResponseData> & {
    authentication: OAuthAppAuthenticationWithoutClientSecret;
  };

export type ExchangeDeviceCodeGitHubAppResponse = OctokitResponse<
  | GitHubAppCreateTokenResponseData
  | GitHubAppCreateTokenWithExpirationResponseData
> & {
  authentication:
    | GitHubAppAuthenticationWithExpirationEnabled
    | GitHubAppAuthenticationWithExpirationDisabled
    | GitHubAppAuthenticationWithRefreshToken;
};

export type ExchangeDeviceCodeGitHubAppResponseWithoutClientSecret =
  OctokitResponse<
    | GitHubAppCreateTokenResponseData
    | GitHubAppCreateTokenWithExpirationResponseData
  > & {
    authentication:
      | GitHubAppAuthenticationWithoutClientSecret
      | GitHubAppAuthenticationWithExpirationWithoutClientSecret;
  };

/**
 * Exchange the code from GitHub's OAuth Web flow for OAuth Apps.
 */
export async function exchangeDeviceCode(
  options: ExchangeDeviceCodeOAuthAppOptions
): Promise<ExchangeDeviceCodeOAuthAppResponse>;

/**
 * Exchange the code from GitHub's OAuth Web flow for OAuth Apps without clientSecret
 */
export async function exchangeDeviceCode(
  options: ExchangeDeviceCodeOAuthAppOptionsWithoutClientSecret
): Promise<ExchangeDeviceCodeOAuthAppResponseWithoutClientSecret>;

/**
 * Exchange the code from GitHub's OAuth Web flow for GitHub Apps. `scopes` are not supported by GitHub Apps.
 */
export async function exchangeDeviceCode(
  options: ExchangeDeviceCodeGitHubAppOptions
): Promise<ExchangeDeviceCodeGitHubAppResponse>;

/**
 * Exchange the code from GitHub's OAuth Web flow for GitHub Apps without using `clientSecret`. `scopes` are not supported by GitHub Apps.
 */
export async function exchangeDeviceCode(
  options: ExchangeDeviceCodeGitHubAppOptionsWithoutClientSecret
): Promise<ExchangeDeviceCodeGitHubAppResponseWithoutClientSecret>;

export async function exchangeDeviceCode(
  options:
    | ExchangeDeviceCodeOAuthAppOptions
    | ExchangeDeviceCodeGitHubAppOptions
    | ExchangeDeviceCodeOAuthAppOptionsWithoutClientSecret
    | ExchangeDeviceCodeGitHubAppOptionsWithoutClientSecret
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
      device_code: options.code,
      grant_type: "urn:ietf:params:oauth:grant-type:device_code",
    }
  );

  const authentication: Record<string, unknown> = {
    clientType: options.clientType,
    clientId: options.clientId,
    token: response.data.access_token,
    scopes: response.data.scope.split(/\s+/).filter(Boolean),
  };

  if ("clientSecret" in options) {
    authentication.clientSecret = options.clientSecret;
  }

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
