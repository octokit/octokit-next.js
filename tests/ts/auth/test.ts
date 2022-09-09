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

  // TODO: @ts-expect-error - auth is required to be set to `{ callback }`
  new OctokitWithCallbackAuth();
}
