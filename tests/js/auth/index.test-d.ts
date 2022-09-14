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
        return "";
      },
    },
  });
  expectType<typeof createCallbackAuth>(test.options.authStrategy);

  // @ts-expect-error - callback must return string
  new OctokitWithCallbackAuth({
    auth: {
      callback() {
        return 1;
      },
    },
  });

  // Note: The code above gets the constructor options type from
  //       `new <NowProvided>(...options: RequiredIfRemaining<PredefinedOptions, NowProvided>)`
  //       while the code below gets the type from Octokit.constructor options
  // TODO: @ts-expect-error - options is required
  new OctokitWithCallbackAuth();

  // TODO: @ts-expect-error - options.auth is required
  new OctokitWithCallbackAuth({});

  // TODO: @ts-expect-error - options.auth must be set to `{ callback }`
  new OctokitWithCallbackAuth({
    auth: "",
  });
}
