// @ts-check

import { auth } from "./lib/auth.js";
import { hook } from "./lib/hook.js";

export function createTokenAuth(options) {
  if (!options?.token) {
    throw new Error(
      "[@octokit/auth-token] options.token not set for createTokenAuth(options)"
    );
  }

  if (typeof options?.token !== "string") {
    throw new Error(
      "[@octokit/auth-token] options.token is not a string for createTokenAuth(options)"
    );
  }

  const token = options.token.replace(/^(token|bearer) +/i, "");

  return Object.assign(auth.bind(null, token), {
    hook: hook.bind(null, token),
  });
}
