import { request as defaultRequest } from "@octokit/request";
import { RequestInterface, Endpoints } from "@octokit/types";
import btoa from "btoa-lite";

import {
  OAuthAppAuthentication,
  GitHubAppAuthenticationWithExpirationEnabled,
  GitHubAppAuthenticationWithExpirationDisabled,
} from "./types";

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

export type CheckTokenOAuthAppResponse =
  Endpoints["POST /applications/{client_id}/token"]["response"] & {
    authentication: OAuthAppAuthentication;
  };
export type CheckTokenGitHubAppResponse =
  Endpoints["POST /applications/{client_id}/token"]["response"] & {
    authentication:
      | GitHubAppAuthenticationWithExpirationEnabled
      | GitHubAppAuthenticationWithExpirationDisabled;
  };

export async function checkToken(
  options: CheckTokenOAuthAppOptions
): Promise<CheckTokenOAuthAppResponse>;
export async function checkToken(
  options: CheckTokenGitHubAppOptions
): Promise<CheckTokenGitHubAppResponse>;

export async function checkToken(
  options: CheckTokenOAuthAppOptions | CheckTokenGitHubAppOptions
): Promise<any> {
  const request =
    options.request ||
    /* istanbul ignore next: we always pass a custom request in tests */
    defaultRequest;

  const response = await request("POST /applications/{client_id}/token", {
    headers: {
      authorization: `basic ${btoa(
        `${options.clientId}:${options.clientSecret}`
      )}`,
    },
    client_id: options.clientId,
    access_token: options.token,
  });

  const authentication: Record<string, unknown> = {
    clientType: options.clientType,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    token: options.token,
    scopes: response.data.scopes,
  };

  if (response.data.expires_at)
    authentication.expiresAt = response.data.expires_at;

  if (options.clientType === "github-app") {
    delete authentication.scopes;
  }

  return { ...response, authentication };
}
