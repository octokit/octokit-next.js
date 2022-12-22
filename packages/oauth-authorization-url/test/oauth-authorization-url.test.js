import test from "ava";

import { oauthAuthorizationUrl } from "../index.js";

const originalMathRandom = Math.random;
test.before(() => {
  Math.random = () => 0.123;
});
test.after(() => {
  Math.random = originalMathRandom;
});

test('oauthAuthorizationUrl({clientId: "1234567890abcdef1234"})', (t) => {
  t.deepEqual(
    oauthAuthorizationUrl({
      clientId: "1234567890abcdef1234",
    }),
    {
      allowSignup: true,
      clientId: "1234567890abcdef1234",
      clientType: "oauth-app",
      login: null,
      redirectUrl: null,
      scopes: [],
      state: "4feornbt361",
      url: "https://github.com/login/oauth/authorize?allow_signup=true&client_id=1234567890abcdef1234&state=4feornbt361",
    }
  );
});

test('oauthAuthorizationUrl({clientId: "1234567890abcdef1234", clientType: "oauth-app"})', (t) => {
  t.deepEqual(
    oauthAuthorizationUrl({
      clientId: "1234567890abcdef1234",
    }),
    {
      allowSignup: true,
      clientId: "1234567890abcdef1234",
      clientType: "oauth-app",
      login: null,
      redirectUrl: null,
      scopes: [],
      state: "4feornbt361",
      url: "https://github.com/login/oauth/authorize?allow_signup=true&client_id=1234567890abcdef1234&state=4feornbt361",
    }
  );
});

test('oauthAuthorizationUrl({clientId: "lv1.1234567890abcdef", clientType: "github-app"})', (t) => {
  t.deepEqual(
    oauthAuthorizationUrl({
      clientId: "lv1.1234567890abcdef",
      clientType: "github-app",
    }),
    {
      allowSignup: true,
      clientId: "lv1.1234567890abcdef",
      clientType: "github-app",
      login: null,
      redirectUrl: null,
      state: "4feornbt361",
      url: "https://github.com/login/oauth/authorize?allow_signup=true&client_id=lv1.1234567890abcdef&state=4feornbt361",
    }
  );
});

test('oauthAuthorizationUrl({clientId: "4321fedcba0987654321"})', (t) => {
  t.deepEqual(
    oauthAuthorizationUrl({
      clientId: "4321fedcba0987654321",
    }),
    {
      allowSignup: true,
      clientId: "4321fedcba0987654321",
      clientType: "oauth-app",
      login: null,
      redirectUrl: null,
      scopes: [],
      state: "4feornbt361",
      url: "https://github.com/login/oauth/authorize?allow_signup=true&client_id=4321fedcba0987654321&state=4feornbt361",
    }
  );
});

test("redirectUrl option", (t) => {
  t.deepEqual(
    oauthAuthorizationUrl({
      clientId: "1234567890abcdef1234",
      redirectUrl: "https://example.com?q=octocat&sort=date",
    }),
    {
      allowSignup: true,
      clientId: "1234567890abcdef1234",
      clientType: "oauth-app",
      login: null,
      redirectUrl: "https://example.com?q=octocat&sort=date",
      scopes: [],
      state: "4feornbt361",
      url: "https://github.com/login/oauth/authorize?allow_signup=true&client_id=1234567890abcdef1234&redirect_uri=https%3A%2F%2Fexample.com%3Fq%3Doctocat%26sort%3Ddate&state=4feornbt361",
    }
  );
});

test("login option", (t) => {
  t.deepEqual(
    oauthAuthorizationUrl({
      clientId: "1234567890abcdef1234",
      login: "octocat",
    }),
    {
      allowSignup: true,
      clientId: "1234567890abcdef1234",
      clientType: "oauth-app",
      login: "octocat",
      redirectUrl: null,
      scopes: [],
      state: "4feornbt361",
      url: "https://github.com/login/oauth/authorize?allow_signup=true&client_id=1234567890abcdef1234&login=octocat&state=4feornbt361",
    }
  );
});

test("scopes = []", (t) => {
  t.deepEqual(
    oauthAuthorizationUrl({
      clientId: "1234567890abcdef1234",
      login: "octocat",
      scopes: [],
    }),
    {
      allowSignup: true,
      clientId: "1234567890abcdef1234",
      clientType: "oauth-app",
      login: "octocat",
      redirectUrl: null,
      scopes: [],
      state: "4feornbt361",
      url: "https://github.com/login/oauth/authorize?allow_signup=true&client_id=1234567890abcdef1234&login=octocat&state=4feornbt361",
    }
  );
});

test('scopes = ""', (t) => {
  t.deepEqual(
    oauthAuthorizationUrl({
      clientId: "1234567890abcdef1234",
      login: "octocat",
      scopes: "",
    }),
    {
      allowSignup: true,
      clientId: "1234567890abcdef1234",
      clientType: "oauth-app",
      login: "octocat",
      redirectUrl: null,
      scopes: [],
      state: "4feornbt361",
      url: "https://github.com/login/oauth/authorize?allow_signup=true&client_id=1234567890abcdef1234&login=octocat&state=4feornbt361",
    }
  );
});

test('scopes = "user,public_repo, gist notifications"', (t) => {
  t.deepEqual(
    oauthAuthorizationUrl({
      clientId: "1234567890abcdef1234",
      login: "octocat",
      scopes: "user,public_repo, gist notifications",
    }),
    {
      allowSignup: true,
      clientId: "1234567890abcdef1234",
      clientType: "oauth-app",
      login: "octocat",
      redirectUrl: null,
      scopes: ["user", "public_repo", "gist", "notifications"],
      state: "4feornbt361",
      url: "https://github.com/login/oauth/authorize?allow_signup=true&client_id=1234567890abcdef1234&login=octocat&scope=user%2Cpublic_repo%2Cgist%2Cnotifications&state=4feornbt361",
    }
  );
});

test("allowSignup = false", (t) => {
  t.deepEqual(
    oauthAuthorizationUrl({
      allowSignup: false,
      clientId: "1234567890abcdef1234",
      login: "octocat",
      scopes: "user,public_repo, gist notifications",
    }),
    {
      allowSignup: false,
      clientId: "1234567890abcdef1234",
      clientType: "oauth-app",
      login: "octocat",
      redirectUrl: null,
      scopes: ["user", "public_repo", "gist", "notifications"],
      state: "4feornbt361",
      url: "https://github.com/login/oauth/authorize?allow_signup=false&client_id=1234567890abcdef1234&login=octocat&scope=user%2Cpublic_repo%2Cgist%2Cnotifications&state=4feornbt361",
    }
  );
});

test("state = Sjn2oMwNFZPiVm6Mtjn2o9b3xxZ4sVEI", (t) => {
  t.deepEqual(
    oauthAuthorizationUrl({
      clientId: "1234567890abcdef1234",
      login: "octocat",
      state: "Sjn2oMwNFZPiVm6Mtjn2o9b3xxZ4sVEI",
    }),
    {
      allowSignup: true,
      clientId: "1234567890abcdef1234",
      clientType: "oauth-app",
      login: "octocat",
      redirectUrl: null,
      scopes: [],
      state: "Sjn2oMwNFZPiVm6Mtjn2o9b3xxZ4sVEI",
      url: "https://github.com/login/oauth/authorize?allow_signup=true&client_id=1234567890abcdef1234&login=octocat&state=Sjn2oMwNFZPiVm6Mtjn2o9b3xxZ4sVEI",
    }
  );
});

test('oauthAuthorizationUrl({clientId: "1234567890abcdef1234", baseUrl: "https://github.my-enterprise.com/"})', (t) => {
  t.deepEqual(
    oauthAuthorizationUrl({
      clientId: "1234567890abcdef1234",
      baseUrl: "https://github.my-enterprise.com",
    }),
    {
      allowSignup: true,
      clientId: "1234567890abcdef1234",
      clientType: "oauth-app",
      login: null,
      redirectUrl: null,
      scopes: [],
      state: "4feornbt361",
      url: "https://github.my-enterprise.com/login/oauth/authorize?allow_signup=true&client_id=1234567890abcdef1234&state=4feornbt361",
    }
  );
});
