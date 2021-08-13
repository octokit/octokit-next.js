import { Octokit } from "@octokit-next/core";

type CallbackStrategyOptions = {
  callback: () => string | Promise<string>;
};

function createCallbackAuth(options: CallbackStrategyOptions) {
  return async function auth() {
    return options.callback();
  };
}

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

  new Octokit({
    authStrategy: createCallbackAuth,
    auth: {
      callback: () => "token",
    },
  });
}
