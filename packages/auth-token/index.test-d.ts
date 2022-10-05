import { expectType } from "tsd";

import { createTokenAuth, AuthTokenAuthentication } from "./index.js";

export async function readmeExample() {
  const auth = createTokenAuth({ token: "token" });
  expectType<Promise<AuthTokenAuthentication>>(auth());

  const result = await auth();
  expectType<"token">(result.type);
  expectType<"oauth" | "installation" | "app" | "user-to-server">(
    result.tokenType
  );
  expectType<string>(result.token);
}

export function invalidStrategyOptions() {
  // @ts-expect-error
  createTokenAuth();

  // @ts-expect-error
  createTokenAuth("invalid");

  // @ts-expect-error
  createTokenAuth({});

  // @ts-expect-error
  createTokenAuth({ token: 123 });

  // @ts-expect-error
  createTokenAuth({ token: "123", invalid: "invalid" });
}

export function invalidAuthOptions() {
  const auth = createTokenAuth({ token: "token" });

  // @ts-expect-error
  auth("invalid");

  // @ts-expect-error
  auth({});
}
