import { request as defaultRequest } from "@octokit/request";
import { RequestInterface, Endpoints } from "@octokit/types";
import btoa from "btoa-lite";

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

export type DeleteTokenResponse =
  Endpoints["DELETE /applications/{client_id}/token"]["response"];

export async function deleteToken(
  options: DeleteTokenOAuthAppOptions
): Promise<DeleteTokenResponse>;
export async function deleteToken(
  options: DeleteTokenGitHubAppOptions
): Promise<DeleteTokenResponse>;

export async function deleteToken(
  options: DeleteTokenOAuthAppOptions | DeleteTokenGitHubAppOptions
): Promise<any> {
  const request =
    options.request ||
    /* istanbul ignore next: we always pass a custom request in tests */
    defaultRequest;

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
