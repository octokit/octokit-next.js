import { Octokit } from "@octokit-next/core";

type CallbackStrategyOptions = {
  callback: () => string | Promise<string>;
};

function createCallbackAuth(options: CallbackStrategyOptions) {
  return async function auth() {
    return options.callback();
  };
}

const OctokitWithCallbackAuth = Octokit.withDefaults({
  authStrategy: createCallbackAuth,
});

new OctokitWithCallbackAuth();

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
    // @ts-expect-error - invalid auth options
    auth: "token",
  });

  new Octokit({
    authStrategy: createCallbackAuth,
    auth: {
      callback: () => "token",
    },
  });

  const OctokitWithCallbackAuth = Octokit.withDefaults({
    authStrategy: createCallbackAuth,
  });

  new OctokitWithCallbackAuth({
    auth: {
      callback() {
        return "";
      },
    },
  });

  // @ts-expect-error - callback must return string
  new OctokitWithCallbackAuth({
    auth: {
      callback() {
        return 1;
      },
    },
  });

  // TODO: @ts-expect-error - auth is required to be set to `{ callback }`
  new OctokitWithCallbackAuth();
}
