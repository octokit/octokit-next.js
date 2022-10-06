import { Octokit } from "@octokit-next/core";
import { AuthStrategyInterface } from "@octokit-next/types";

type CallbackAuthentication = {
  token: string;
};
type CallbackStrategyOptions = {
  callback: () => CallbackAuthentication | Promise<CallbackAuthentication>;
};

const createCallbackAuth: AuthStrategyInterface<{
  StrategyOptions: CallbackStrategyOptions;
  Authentication: CallbackAuthentication;
}> = (options: CallbackStrategyOptions) => {
  return Object.assign(
    async function auth() {
      return options.callback();
    },
    {
      async hook(request: any, options: any) {
        return request(options);
      },
    }
  );
};

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
        return { token: "secret" };
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
      callback: () => ({ token: "secret" }),
    },
  });

  const OctokitWithCallbackAuth = Octokit.withDefaults({
    authStrategy: createCallbackAuth,
  });

  new OctokitWithCallbackAuth({
    auth: {
      callback() {
        return { token: "" };
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
