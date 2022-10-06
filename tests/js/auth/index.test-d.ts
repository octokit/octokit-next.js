import { expectType } from "tsd";

import { AuthStrategyInterface } from "@octokit-next/types";
import { Octokit } from "./index.js";

declare const createCallbackAuth: AuthStrategyInterface<{
  StrategyOptions: { callback: () => string | Promise<string> };
  Authentication: { token: string; source: "callback" };
}>;

export async function test() {
  // set auth to access token
  new Octokit({
    auth: "token",
  });

  // @ts-expect-error - auth is required to be set to `{ callback }`
  new Octokit({
    authStrategy: createCallbackAuth,
  });

  const octokit = new Octokit({
    authStrategy: createCallbackAuth,
    auth: {
      callback() {
        return "secret";
      },
    },
  });
  const result = await octokit.auth();
  expectType<"callback">(result.source);

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

  // @ts-expect-error - callback must return string
  new OctokitWithCallbackAuth({
    auth: {
      callback() {
        return 1;
      },
    },
  });

  const auth = createCallbackAuth({ callback: () => "token" });

  const result2 = await auth();
  expectType<"callback">(result2.source);
  const response = await auth.hook(octokit.request, {
    method: "GET",
    url: "/",
    headers: {},
  });

  expectType<Octokit.Response<unknown, number, Octokit.ResponseHeaders>>(
    response
  );
}
