import { request as defaultRequest } from "@octokit/request";
import { OctokitResponse, RequestInterface } from "@octokit/types";

import { oauthRequest } from "./utils";

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

export type CreateDeviceCodeDeviceTokenResponse = OctokitResponse<{
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}>;

export async function createDeviceCode(
  options: CreateDeviceCodeOAuthAppOptions | CreateDeviceCodeGitHubAppOptions
): Promise<CreateDeviceCodeDeviceTokenResponse> {
  const request =
    options.request ||
    /* istanbul ignore next: we always pass a custom request in tests */
    defaultRequest;

  const parameters: Record<string, unknown> = {
    client_id: options.clientId,
  };

  if ("scopes" in options && Array.isArray(options.scopes)) {
    parameters.scope = options.scopes.join(" ");
  }

  return oauthRequest(request, "POST /login/device/code", parameters);
}
