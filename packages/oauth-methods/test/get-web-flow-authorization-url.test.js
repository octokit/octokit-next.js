import test from "ava";
import { request } from "@octokit-next/request";

import { getWebFlowAuthorizationUrl } from "../index.js";

test("README example", (t) => {
  const { url } = getWebFlowAuthorizationUrl({
    clientType: "oauth-app",
    clientId: "1234567890abcdef1234",
    scopes: ["repo"],
    state: "state123",
  });

  t.is(
    url,
    "https://github.com/login/oauth/authorize?allow_signup=true&client_id=1234567890abcdef1234&scope=repo&state=state123"
  );
});

test("all options for OAuth Apps", (t) => {
  const result = getWebFlowAuthorizationUrl({
    clientType: "oauth-app",
    clientId: "1234567890abcdef1234",
    scopes: ["repo"],
    state: "state123",
    allowSignup: false,
    redirectUrl: "https://acme-inc.com/login",
    login: "octocat",
    request: request.defaults({
      baseUrl: "https://ghe.acme-inc.com/api/v3",
    }),
  });

  t.snapshot(result);
});

test("all options for GitHub Apps", (t) => {
  const result = getWebFlowAuthorizationUrl({
    clientType: "github-app",
    clientId: "lv1.1234567890abcdef",
    state: "state123",
    allowSignup: false,
    redirectUrl: "https://acme-inc.com/login",
    login: "octocat",
    request: request.defaults({
      baseUrl: "https://ghe.acme-inc.com/api/v3",
    }),
  });

  t.snapshot(result);
});
