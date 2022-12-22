import { Octokit, RequestInterface } from "@octokit-next/types";
import "@octokit-next/types-rest-api";

import {
  OAuthAppResult,
  GitHubAppResult,
} from "@octokit-next/oauth-authorization-url";

export type VERSION = string;

export type OAuthAppAuthentication = {
  clientType: "oauth-app";
  clientId: string;
  clientSecret: string;
  token: string;
  scopes: string[];
};

export type GitHubAppAuthenticationWithExpirationDisabled = {
  clientType: "github-app";
  clientId: string;
  clientSecret: string;
  token: string;
};

export type GitHubAppAuthenticationWithExpirationEnabled =
  GitHubAppAuthenticationWithExpirationDisabled & { expiresAt: string };

export type GitHubAppAuthenticationWithRefreshToken =
  GitHubAppAuthenticationWithExpirationEnabled & {
    refreshToken: string;
    refreshTokenExpiresAt: string;
  };

export type OAuthAppCreateTokenResponseData = {
  access_token: string;
  scope: string;
  token_type: "bearer";
};
export type GitHubAppCreateTokenResponseData = {
  access_token: string;
  token_type: "bearer";
};
export type GitHubAppCreateTokenWithExpirationResponseData = {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
};

// checkToken() types
export type CheckTokenOAuthAppOptions = {
  clientType: "oauth-app";
  clientId: string;
  clientSecret: string;
  token: string;
  request?: RequestInterface;
};
export type CheckTokenGitHubAppOptions = {
  clientType: "github-app";
  clientId: string;
  clientSecret: string;
  token: string;
  request?: RequestInterface;
};
export type CheckTokenOptions =
  | CheckTokenOAuthAppOptions
  | CheckTokenGitHubAppOptions;

export type CheckTokenOAuthAppResponse =
  Octokit.Endpoints["POST /applications/{client_id}/token"]["response"] & {
    authentication: OAuthAppAuthentication;
  };
export type CheckTokenGitHubAppResponse =
  Octokit.Endpoints["POST /applications/{client_id}/token"]["response"] & {
    authentication:
      | GitHubAppAuthenticationWithExpirationEnabled
      | GitHubAppAuthenticationWithExpirationDisabled;
  };

export type CheckTokenResponse =
  | CheckTokenOAuthAppResponse
  | CheckTokenGitHubAppResponse;

/**
 * check OAuth token for an OAuth App
 */
export function checkToken(
  options: CheckTokenOAuthAppOptions
): Promise<CheckTokenOAuthAppResponse>;

/**
 * check user-to-server token for a GitHub App
 */
export function checkToken(
  options: CheckTokenGitHubAppOptions
): Promise<CheckTokenGitHubAppResponse>;

// createDeviceCode() types

export type CreateDeviceCodeOAuthAppOptions = {
  clientType: "oauth-app";
  clientId: string;
  scopes?: string[];
  request?: RequestInterface;
};
export type CreateDeviceCodeGitHubAppOptions = {
  clientType: "github-app";
  clientId: string;
  request?: RequestInterface;
};
export type CreateDeviceCodeOptions =
  | CreateDeviceCodeOAuthAppOptions
  | CreateDeviceCodeGitHubAppOptions;

export type CreateDeviceCodeDeviceTokenResponse = Octokit.Response<
  {
    device_code: string;
    user_code: string;
    verification_uri: string;
    expires_in: number;
    interval: number;
  },
  number
>;

export function createDeviceCode(
  options: CreateDeviceCodeOAuthAppOptions | CreateDeviceCodeGitHubAppOptions
): Promise<CreateDeviceCodeDeviceTokenResponse>;

// deleteAuthorization() types

export type DeleteAuthorizationOAuthAppOptions = {
  clientType: "oauth-app";
  clientId: string;
  clientSecret: string;
  token: string;
  request?: RequestInterface;
};
export type DeleteAuthorizationGitHubAppOptions = {
  clientType: "github-app";
  clientId: string;
  clientSecret: string;
  token: string;
  request?: RequestInterface;
};

export type DeleteAuthorizationOptions =
  | DeleteAuthorizationOAuthAppOptions
  | DeleteAuthorizationGitHubAppOptions;

export type DeleteAuthorizationResponse =
  Octokit.Endpoints["DELETE /applications/{client_id}/grant"]["response"];

export function deleteAuthorization(
  options: DeleteAuthorizationOAuthAppOptions
): Promise<DeleteAuthorizationResponse>;
export function deleteAuthorization(
  options: DeleteAuthorizationGitHubAppOptions
): Promise<DeleteAuthorizationResponse>;

// deleteToken() types

export type DeleteTokenOAuthAppOptions = {
  clientType: "oauth-app";
  clientId: string;
  clientSecret: string;
  token: string;
  request?: RequestInterface;
};
export type DeleteTokenGitHubAppOptions = {
  clientType: "github-app";
  clientId: string;
  clientSecret: string;
  token: string;
  request?: RequestInterface;
};

export type DeleteTokenOptions =
  | DeleteTokenOAuthAppOptions
  | DeleteTokenGitHubAppOptions;

export type DeleteTokenResponse =
  Octokit.Endpoints["DELETE /applications/{client_id}/token"]["response"];

export function deleteToken(
  options: DeleteTokenOAuthAppOptions
): Promise<DeleteTokenResponse>;
export function deleteToken(
  options: DeleteTokenGitHubAppOptions
): Promise<DeleteTokenResponse>;

// exchangeDeviceCode() types

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

export type ExchangeDeviceCodeOptions =
  | ExchangeDeviceCodeOAuthAppOptions
  | ExchangeDeviceCodeOAuthAppOptionsWithoutClientSecret
  | ExchangeDeviceCodeGitHubAppOptions
  | ExchangeDeviceCodeGitHubAppOptionsWithoutClientSecret;

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

export type ExchangeDeviceCodeOAuthAppResponse = Octokit.Response<
  OAuthAppCreateTokenResponseData,
  number
> & {
  authentication: OAuthAppAuthentication;
};

export type ExchangeDeviceCodeOAuthAppResponseWithoutClientSecret =
  Octokit.Response<OAuthAppCreateTokenResponseData, number> & {
    authentication: OAuthAppAuthenticationWithoutClientSecret;
  };

export type ExchangeDeviceCodeGitHubAppResponse = Octokit.Response<
  | GitHubAppCreateTokenResponseData
  | GitHubAppCreateTokenWithExpirationResponseData,
  number
> & {
  authentication:
    | GitHubAppAuthenticationWithExpirationEnabled
    | GitHubAppAuthenticationWithExpirationDisabled
    | GitHubAppAuthenticationWithRefreshToken;
};

export type ExchangeDeviceCodeGitHubAppResponseWithoutClientSecret =
  Octokit.Response<
    | GitHubAppCreateTokenResponseData
    | GitHubAppCreateTokenWithExpirationResponseData,
    number
  > & {
    authentication:
      | GitHubAppAuthenticationWithoutClientSecret
      | GitHubAppAuthenticationWithExpirationWithoutClientSecret;
  };

export type ExchangeDeviceCodeResponse =
  | ExchangeDeviceCodeOAuthAppResponse
  | ExchangeDeviceCodeOAuthAppResponseWithoutClientSecret
  | ExchangeDeviceCodeGitHubAppResponse
  | ExchangeDeviceCodeGitHubAppResponseWithoutClientSecret;

/**
 * Exchange the code from GitHub's OAuth Web flow for OAuth Apps.
 */
export function exchangeDeviceCode(
  options: ExchangeDeviceCodeOAuthAppOptions
): Promise<ExchangeDeviceCodeOAuthAppResponse>;

/**
 * Exchange the code from GitHub's OAuth Web flow for OAuth Apps without clientSecret
 */
export function exchangeDeviceCode(
  options: ExchangeDeviceCodeOAuthAppOptionsWithoutClientSecret
): Promise<ExchangeDeviceCodeOAuthAppResponseWithoutClientSecret>;

/**
 * Exchange the code from GitHub's OAuth Web flow for GitHub Apps. `scopes` are not supported by GitHub Apps.
 */
export function exchangeDeviceCode(
  options: ExchangeDeviceCodeGitHubAppOptions
): Promise<ExchangeDeviceCodeGitHubAppResponse>;

/**
 * Exchange the code from GitHub's OAuth Web flow for GitHub Apps without using `clientSecret`. `scopes` are not supported by GitHub Apps.
 */
export function exchangeDeviceCode(
  options: ExchangeDeviceCodeGitHubAppOptionsWithoutClientSecret
): Promise<ExchangeDeviceCodeGitHubAppResponseWithoutClientSecret>;

// exchangeWebFlowCode() types

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

export type ExchangeWebFlowCodeOptions =
  | ExchangeWebFlowCodeOAuthAppOptions
  | ExchangeWebFlowCodeGitHubAppOptions;

export type ExchangeWebFlowCodeOAuthAppResponse = Octokit.Response<
  OAuthAppCreateTokenResponseData,
  number
> & {
  authentication: OAuthAppAuthentication;
};
export type ExchangeWebFlowCodeGitHubAppResponse = Octokit.Response<
  | GitHubAppCreateTokenResponseData
  | GitHubAppCreateTokenWithExpirationResponseData,
  number
> & {
  authentication:
    | GitHubAppAuthenticationWithExpirationEnabled
    | GitHubAppAuthenticationWithExpirationDisabled
    | GitHubAppAuthenticationWithRefreshToken;
};

export type ExchangeWebFlowCodeResponse =
  | ExchangeWebFlowCodeOAuthAppResponse
  | ExchangeWebFlowCodeGitHubAppResponse;

/**
 * Exchange the code from GitHub's OAuth Web flow for OAuth Apps.
 */
export function exchangeWebFlowCode(
  options: ExchangeWebFlowCodeOAuthAppOptions
): Promise<ExchangeWebFlowCodeOAuthAppResponse>;

/**
 * Exchange the code from GitHub's OAuth Web flow for GitHub Apps. Note that `scopes` are not supported by GitHub Apps.
 */
export function exchangeWebFlowCode(
  options: ExchangeWebFlowCodeGitHubAppOptions
): Promise<ExchangeWebFlowCodeGitHubAppResponse>;

// refreshToken() types

export type RefreshTokenOptions = {
  clientType: "github-app";
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  request?: RequestInterface;
};

export type RefreshTokenResponse = Octokit.Response<
  GitHubAppCreateTokenWithExpirationResponseData,
  number
> & {
  authentication: GitHubAppAuthenticationWithRefreshToken;
};

/**
 * Refresh an expiring user-to-server token.
 */
export function refreshToken(
  options: RefreshTokenOptions
): Promise<RefreshTokenResponse>;

// getWebFlowAuthorizationUrl() types

export type GetWebFlowAuthorizationUrlOAuthAppOptions = {
  clientType: "oauth-app";
  clientId: string;

  allowSignup?: boolean;
  login?: string;
  scopes?: string | string[];
  redirectUrl?: string;
  state?: string;
  request?: RequestInterface;
};

export type GetWebFlowAuthorizationUrlGitHubAppOptions = {
  clientType: "github-app";
  clientId: string;

  allowSignup?: boolean;
  login?: string;
  redirectUrl?: string;
  state?: string;
  request?: RequestInterface;
};

export type GetWebFlowAuthorizationUrlOptions =
  | GetWebFlowAuthorizationUrlOAuthAppOptions
  | GetWebFlowAuthorizationUrlGitHubAppOptions;

export type GetWebFlowAuthorizationUrlOAuthAppResult = OAuthAppResult;
export type GetWebFlowAuthorizationUrlGitHubAppResult = GitHubAppResult;
export type GetWebFlowAuthorizationUrlResult =
  | GetWebFlowAuthorizationUrlOAuthAppResult
  | GetWebFlowAuthorizationUrlGitHubAppResult;

/**
 * Get the URL to redirect the user to for GitHub's OAuth Web flow for OAuth Apps.
 */
export function getWebFlowAuthorizationUrl(
  options: GetWebFlowAuthorizationUrlOAuthAppOptions
): GetWebFlowAuthorizationUrlOAuthAppResult;
/**
 * Get the URL to redirect the user to for GitHub's OAuth Web flow for GitHub Apps.
 */
export function getWebFlowAuthorizationUrl(
  options: GetWebFlowAuthorizationUrlGitHubAppOptions
): GetWebFlowAuthorizationUrlGitHubAppResult;

// resetToken() types

export type ResetTokenOAuthAppOptions = {
  clientType: "oauth-app";
  clientId: string;
  clientSecret: string;
  token: string;
  request?: RequestInterface;
};
export type ResetTokenGitHubAppOptions = {
  clientType: "github-app";
  clientId: string;
  clientSecret: string;
  token: string;
  request?: RequestInterface;
};

export type ResetTokenOptions =
  | ResetTokenOAuthAppOptions
  | ResetTokenGitHubAppOptions;

export type ResetTokenOAuthAppResponse =
  Octokit.Endpoints["PATCH /applications/{client_id}/token"]["response"] & {
    authentication: OAuthAppAuthentication;
  };
export type ResetTokenGitHubAppResponse =
  Octokit.Endpoints["PATCH /applications/{client_id}/token"]["response"] & {
    authentication:
      | GitHubAppAuthenticationWithExpirationEnabled
      | GitHubAppAuthenticationWithExpirationDisabled;
  };

export type ResetTokenResponse =
  | ResetTokenOAuthAppResponse
  | ResetTokenGitHubAppResponse;

/**
 * Reset an OAuth App's token.
 */
export function resetToken(
  options: ResetTokenOAuthAppOptions
): Promise<ResetTokenOAuthAppResponse>;
/**
 * Reset a GitHub App's token.
 */
export function resetToken(
  options: ResetTokenGitHubAppOptions
): Promise<ResetTokenGitHubAppResponse>;

// scopeToken() types
type ScopeTokenEndpoint =
  Octokit.Endpoints["POST /applications/{client_id}/token/scoped"];

type CommonOptions = {
  clientType: "github-app";
  clientId: string;
  clientSecret: string;
  token: string;
  permissions?: ScopeTokenEndpoint["parameters"]["permissions"];
  request?: RequestInterface;
};

type TargetOption = {
  target: string;
};
type TargetIdOption = {
  target_id: number;
};
type RepositoriesOption = {
  repositories?: string[];
};
type RepositoryIdsOption = {
  repository_ids?: number[];
};

export type ScopeTokenOptions =
  | (CommonOptions & TargetOption & RepositoriesOption)
  | (CommonOptions & TargetIdOption & RepositoriesOption)
  | (CommonOptions & TargetOption & RepositoryIdsOption)
  | (CommonOptions & TargetIdOption & RepositoryIdsOption);

export type ScopeTokenResponse = ScopeTokenEndpoint["response"] & {
  authentication:
    | GitHubAppAuthenticationWithExpirationEnabled
    | GitHubAppAuthenticationWithExpirationDisabled;
};

/**
 * Scope a GitHub App's token.
 */
export function scopeToken(
  options: ScopeTokenOptions
): Promise<ScopeTokenResponse>;
