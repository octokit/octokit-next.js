import { RequestInterface } from "./request";
import { Octokit } from "./index.js";

export type AuthAbstractConfig = {
  StrategyOptions?: Record<string, unknown>;
  AuthOptions?: Record<string, unknown>;
  Authentication: Record<string, unknown>;
};

export interface AuthAbstractSrategyInterface {
  (...args: any[]): (...args: any[]) => Promise<any>;
}

export interface AuthStrategyInterface<
  TConfig extends AuthAbstractConfig = AuthAbstractConfig
> {
  (
    ...args: "StrategyOptions" extends keyof TConfig
      ? [TConfig["StrategyOptions"]]
      : []
  ): AuthInterface<TConfig>;
}

export interface AuthInterface<
  TConfig extends AuthAbstractConfig = AuthAbstractConfig
> {
  (
    ...args: "AuthOptions" extends keyof TConfig ? [TConfig["AuthOptions"]] : []
  ): Promise<TConfig["Authentication"]>;

  hook: {
    /**
     * Use the `request` instance and the endpoint options to hook into the request lifecycle as needed.
     *
     * @param {RequestInterface} request
     * @param {Octokit.EndpointOptions} options
     */
    (request: RequestInterface, options: Octokit.EndpointOptions): Promise<
      Octokit.Response<unknown, number>
    >;
  };
}

// token auth is built into @octokit-next/core so we define it as part of @octokit-next/types

export type AuthTokenAuthenticationOAuth = {
  type: "token";
  tokenType: "oauth";
  token: string;
};
export type AuthTokenAuthenticationInstallation = {
  type: "token";
  tokenType: "installation";
  token: string;
};
export type AuthTokenAuthenticationApp = {
  type: "token";
  tokenType: "app";
  token: string;
};
export type AuthTokenAuthenticationUserToServer = {
  type: "token";
  tokenType: "user-to-server";
  token: string;
};

export type AuthTokenAuthentication =
  | AuthTokenAuthenticationOAuth
  | AuthTokenAuthenticationInstallation
  | AuthTokenAuthenticationApp
  | AuthTokenAuthenticationUserToServer;

export type AuthTokenConfig = {
  StrategyOptions: {
    token: string;
  };
  Authentication: AuthTokenAuthentication;
};

export declare const createTokenAuth: AuthStrategyInterface<AuthTokenConfig>;
