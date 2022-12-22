import { expectType, expectNotType } from "tsd";

import {
  oauthAuthorizationUrl,
  ClientType,
  GitHubAppOptions,
  GitHubAppResult,
  OAuthAppOptions,
  OAuthAppResult,
} from "./index.js";

export async function oauthAppReadmeExample() {
  const { url, clientId, redirectUrl, login, scopes, state } =
    oauthAuthorizationUrl({
      clientType: "oauth-app",
      clientId: "1234567890abcdef1234",
      redirectUrl: "https://example.com",
      login: "octocat",
      scopes: ["repo", "admin:org"],
      state: "secret123",
    });

  expectType<string>(url);
  expectType<string>(clientId);
  expectType<string | null>(redirectUrl);
  expectType<string | null>(login);
  expectType<string[]>(scopes);
  expectType<string>(state);
}

export async function githubAppReadmeExample() {
  const { url, clientId, redirectUrl, login, state } = oauthAuthorizationUrl({
    clientType: "github-app",
    clientId: "lv1.1234567890abcdef",
    redirectUrl: "https://example.com",
    login: "octocat",
    state: "secret123",
  });

  expectType<string>(url);
  expectType<string>(clientId);
  expectType<string | null>(redirectUrl);
  expectType<string | null>(login);
  expectType<string>(state);
}

export function typeTests() {
  const oauthclientType: ClientType = "oauth-app";
  const githubclientType: ClientType = "github-app";
  // @ts-expect-error
  const invalidclientType: ClientType = "invalid";

  const oauthOptions: OAuthAppOptions = {
    clientId: "",
    clientType: "oauth-app",
    allowSignup: true,
    login: "",
    scopes: [],
    redirectUrl: "",
    state: "",
    baseUrl: "",
  };

  const githubOptions: GitHubAppOptions = {
    clientId: "",
    clientType: "github-app",
    allowSignup: true,
    login: "",
    redirectUrl: "",
    state: "",
    baseUrl: "",
  };

  const oauthResult: OAuthAppResult = {
    url: "",
    allowSignup: true,
    clientId: "",
    clientType: "oauth-app",
    login: "",
    redirectUrl: "",
    scopes: [],
    state: "",
  };

  const githubResult: GitHubAppResult = {
    url: "",
    allowSignup: true,
    clientId: "",
    clientType: "github-app",
    login: "",
    redirectUrl: "",
    state: "",
  };
}
