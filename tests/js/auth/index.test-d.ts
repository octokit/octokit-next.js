import { expectType } from "tsd";

import { Octokit } from "./index.js";

type CallbackStrategyOptions = {
  callback(): Promise<string>;
};

type AuthUnauthenticated = {
  type: "unauthenticated";
};

type AuthToken = {
  type: "token";
  token: string;
};

interface CallbackAuth {
  (): Promise<AuthUnauthenticated | AuthToken>;
}

declare function createCallbackAuth(
  options: CallbackStrategyOptions
): CallbackAuth;

export async function test() {
  // set auth to access token
  new Octokit({
    auth: "token",
  });

  // @ts-expect-error - auth is required to be set to `{ callback }`
  new Octokit({
    authStrategy: createCallbackAuth,
  });

  // @ts-expect-error - invalid auth options
  new Octokit({
    authStrategy: createCallbackAuth,
    auth: "token",
  });

  const OctokitWithCallbackAuth = Octokit.withDefaults({
    authStrategy: createCallbackAuth,
  });

  // @ts-expect-error - auth is required to be set to `{ callback }`
  new OctokitWithCallbackAuth();
}
