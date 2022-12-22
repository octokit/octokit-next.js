import test from "ava";

import { oauthAuthorizationUrl } from "../index.js";

test("oauthAuthorizationUrl is a function", (t) => {
  t.assert(oauthAuthorizationUrl instanceof Function);
});
