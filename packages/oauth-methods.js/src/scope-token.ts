import { request as defaultRequest } from "@octokit/request";
import { RequestInterface, Endpoints } from "@octokit/types";
import btoa from "btoa-lite";

import {
  GitHubAppAuthenticationWithExpirationEnabled,
  GitHubAppAuthenticationWithExpirationDisabled,
} from "./types";

type CommonOptions = {
  clientType: "github-app";
  clientId: string;
  clientSecret: string;
  token: string;
  permissions?: Endpoint["parameters"]["permissions"];
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

type Endpoint = Endpoints["POST /applications/{client_id}/token/scoped"];

export type ScopeTokenOptions =
  | (CommonOptions & TargetOption & RepositoriesOption)
  | (CommonOptions & TargetIdOption & RepositoriesOption)
  | (CommonOptions & TargetOption & RepositoryIdsOption)
  | (CommonOptions & TargetIdOption & RepositoryIdsOption);

export type ScopeTokenResponse = Endpoint["response"] & {
  authentication:
    | GitHubAppAuthenticationWithExpirationEnabled
    | GitHubAppAuthenticationWithExpirationDisabled;
};

export async function scopeToken(
  options: ScopeTokenOptions
): Promise<ScopeTokenResponse> {
  const {
    request: optionsRequest,
    clientType,
    clientId,
    clientSecret,
    token,
    ...requestOptions
  } = options;

  const request =
    optionsRequest ||
    /* istanbul ignore next: we always pass a custom request in tests */
    defaultRequest;

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

  const authentication:
    | GitHubAppAuthenticationWithExpirationEnabled
    | GitHubAppAuthenticationWithExpirationDisabled = Object.assign(
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
