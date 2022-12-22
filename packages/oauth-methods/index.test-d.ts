import { expectType } from "tsd";
import {
  // methods
  getWebFlowAuthorizationUrl,
  exchangeWebFlowCode,
  createDeviceCode,
  exchangeDeviceCode,
  checkToken,
  refreshToken,
  scopeToken,
  resetToken,
  deleteToken,
  deleteAuthorization,
  // types
  OAuthAppAuthentication,
  GitHubAppAuthenticationWithExpirationDisabled,
  GitHubAppAuthenticationWithExpirationEnabled,
  GetWebFlowAuthorizationUrlOptions,
  GetWebFlowAuthorizationUrlOAuthAppOptions,
  GetWebFlowAuthorizationUrlGitHubAppOptions,
  GetWebFlowAuthorizationUrlResult,
  GetWebFlowAuthorizationUrlOAuthAppResult,
  GetWebFlowAuthorizationUrlGitHubAppResult,
  CheckTokenOptions,
  CheckTokenOAuthAppOptions,
  CheckTokenGitHubAppOptions,
  CheckTokenResponse,
  CheckTokenOAuthAppResponse,
  CheckTokenGitHubAppResponse,
  ExchangeWebFlowCodeOptions,
  ExchangeWebFlowCodeOAuthAppOptions,
  ExchangeWebFlowCodeGitHubAppOptions,
  ExchangeWebFlowCodeResponse,
  ExchangeWebFlowCodeOAuthAppResponse,
  ExchangeWebFlowCodeGitHubAppResponse,
  CreateDeviceCodeOptions,
  CreateDeviceCodeOAuthAppOptions,
  CreateDeviceCodeGitHubAppOptions,
  CreateDeviceCodeDeviceTokenResponse,
  ExchangeDeviceCodeOptions,
  ExchangeDeviceCodeOAuthAppOptionsWithoutClientSecret,
  ExchangeDeviceCodeOAuthAppOptions,
  ExchangeDeviceCodeGitHubAppOptionsWithoutClientSecret,
  ExchangeDeviceCodeGitHubAppOptions,
  ExchangeDeviceCodeResponse,
  ExchangeDeviceCodeOAuthAppResponse,
  ExchangeDeviceCodeOAuthAppResponseWithoutClientSecret,
  ExchangeDeviceCodeGitHubAppResponse,
  ExchangeDeviceCodeGitHubAppResponseWithoutClientSecret,
  RefreshTokenOptions,
  RefreshTokenResponse,
  ScopeTokenOptions,
  ScopeTokenResponse,
  ResetTokenOptions,
  ResetTokenOAuthAppOptions,
  ResetTokenGitHubAppOptions,
  ResetTokenResponse,
  ResetTokenOAuthAppResponse,
  ResetTokenGitHubAppResponse,
  DeleteTokenOptions,
  DeleteTokenOAuthAppOptions,
  DeleteTokenGitHubAppOptions,
  DeleteTokenResponse,
  DeleteAuthorizationOptions,
  DeleteAuthorizationOAuthAppOptions,
  DeleteAuthorizationGitHubAppOptions,
  DeleteAuthorizationResponse,
} from "@octokit-next/oauth-methods";

export function testGetWebFlowAuthorizationUrl() {
  const result = getWebFlowAuthorizationUrl({
    clientType: "oauth-app",
    clientId: "1234567890abcdef1234",
    scopes: ["repo"],
  });
  expectType<GetWebFlowAuthorizationUrlOAuthAppResult>(result);
}

export async function testExchangeWebFlowCode() {
  const response = await exchangeWebFlowCode({
    clientType: "oauth-app",
    clientId: "1234567890abcdef1234",
    clientSecret: "1234567890abcdef12347890abcdef12345678",
    code: "code123",
  });

  expectType<ExchangeWebFlowCodeOAuthAppResponse>(response);
}

export async function testCreateDeviceCode() {
  const response = await createDeviceCode({
    clientType: "oauth-app",
    clientId: "1234567890abcdef1234",
    scopes: ["repo"],
  });

  expectType<CreateDeviceCodeDeviceTokenResponse>(response);
}

export async function testExchangeDeviceCode() {
  const response = await exchangeDeviceCode({
    clientType: "oauth-app",
    clientId: "1234567890abcdef1234",
    code: "code123",
  });

  expectType<ExchangeDeviceCodeOAuthAppResponseWithoutClientSecret>(response);
}

export async function testCheckToken() {
  const response = await checkToken({
    clientType: "oauth-app",
    clientId: "1234567890abcdef1234",
    clientSecret: "1234567890abcdef12347890abcdef12345678",
    token: "usertoken123",
  });

  expectType<CheckTokenOAuthAppResponse>(response);
}

export async function testRefreshToken() {
  const response = await refreshToken({
    clientType: "github-app",
    clientId: "lv1.1234567890abcdef",
    clientSecret: "1234567890abcdef12347890abcdef12345678",
    refreshToken: "r1.refreshtoken123",
  });

  expectType<RefreshTokenResponse>(response);
}

export async function testScopeToken() {
  const response = await scopeToken({
    clientType: "github-app",
    clientId: "lv1.1234567890abcdef",
    clientSecret: "1234567890abcdef12347890abcdef12345678",
    token: "usertoken123",
    target: "octokit",
    repositories: ["oauth-methods.js"],
    permissions: {
      issues: "write",
    },
  });

  expectType<ScopeTokenResponse>(response);
}

export async function testResetToken() {
  const response = await resetToken({
    clientType: "oauth-app",
    clientId: "1234567890abcdef1234",
    clientSecret: "1234567890abcdef12347890abcdef12345678",
    token: "usertoken123",
  });

  expectType<ResetTokenOAuthAppResponse>(response);
}

export async function testDeleteToken() {
  const response = await deleteToken({
    clientType: "oauth-app",
    clientId: "1234567890abcdef1234",
    clientSecret: "1234567890abcdef12347890abcdef12345678",
    token: "usertoken123",
  });

  expectType<DeleteTokenResponse>(response);
}

export async function testDeleteAuthorization() {
  const response = await deleteAuthorization({
    clientType: "oauth-app",
    clientId: "1234567890abcdef1234",
    clientSecret: "1234567890abcdef12347890abcdef12345678",
    token: "usertoken123",
  });

  expectType<DeleteAuthorizationResponse>(response);
}
