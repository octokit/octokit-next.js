import {
  oauthAuthorizationUrl,
  OAuthAppResult,
  GitHubAppResult,
} from "@octokit/oauth-authorization-url";
import { request as defaultRequest } from "@octokit/request";
import { RequestInterface } from "@octokit/types";

import { requestToOAuthBaseUrl } from "./utils";

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

export type GetWebFlowAuthorizationUrlOAuthAppResult = OAuthAppResult;
export type GetWebFlowAuthorizationUrlGitHubAppResult = GitHubAppResult;

export function getWebFlowAuthorizationUrl(
  options: GetWebFlowAuthorizationUrlOAuthAppOptions
): OAuthAppResult;
export function getWebFlowAuthorizationUrl(
  options: GetWebFlowAuthorizationUrlGitHubAppOptions
): GitHubAppResult;

export function getWebFlowAuthorizationUrl({
  request = defaultRequest,
  ...options
}:
  | GetWebFlowAuthorizationUrlOAuthAppOptions
  | GetWebFlowAuthorizationUrlGitHubAppOptions):
  | GetWebFlowAuthorizationUrlOAuthAppResult
  | GetWebFlowAuthorizationUrlGitHubAppResult {
  const baseUrl = requestToOAuthBaseUrl(request);

  // @ts-expect-error TypeScript wants `clientType` to be set explicitly ¯\_(ツ)_/¯
  return oauthAuthorizationUrl({
    ...options,
    baseUrl,
  });
}
