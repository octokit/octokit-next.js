import { expectType } from "tsd";

import { Octokit } from "./index.js";

type CallbackStrategyOptions = {
  callback: () => string | Promise<string>;
};
interface CallbackAuth {
  (options?: Record<string, unknown>): Promise<unknown>;
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

  new Octokit({
    authStrategy: createCallbackAuth,
    auth: {
      callback() {
        return "secret";
      },
    },
  });

  new Octokit({
    authStrategy: createCallbackAuth,
    auth: {
      // @ts-expect-error - callback must return string
      callback() {},
    },
  });

  new Octokit({
    authStrategy: createCallbackAuth,
    // @ts-expect-error - auth must be set to `{ callback }`
    auth: "token",
  });

  const OctokitWithCallbackAuth = Octokit.withDefaults({
    authStrategy: createCallbackAuth,
  });

  const test = new OctokitWithCallbackAuth({
    auth: {
      callback() {
        return "secret";
      },
    },
  });
  expectType<typeof createCallbackAuth>(test.options.authStrategy);

  // TODO: @ts-expect-error - auth is required to be set to `{ callback }`
  new OctokitWithCallbackAuth();
}
