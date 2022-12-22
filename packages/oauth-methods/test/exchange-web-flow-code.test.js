import test from "ava";
import fetchMock from "fetch-mock";
import { request } from "@octokit-next/request";

import { exchangeWebFlowCode } from "../index.js";

test("README example", async (t) => {
  const mock = fetchMock.sandbox().postOnce(
    "https://github.com/login/oauth/access_token",
    {
      access_token: "secret123",
      scope: "",
      token_type: "bearer",
    },
    {
      headers: {
        accept: "application/json",
        "user-agent": "test",
        "content-type": "application/json; charset=utf-8",
      },
      body: {
        client_id: "1234567890abcdef1234",
        client_secret: "1234567890abcdef12347890abcdef12345678",
        code: "code123",
      },
    }
  );

  const { data, authentication } = await exchangeWebFlowCode({
    clientType: "oauth-app",
    clientId: "1234567890abcdef1234",
    clientSecret: "1234567890abcdef12347890abcdef12345678",
    code: "code123",
    request: request.defaults({
      headers: {
        "user-agent": "test",
      },
      request: {
        fetch: mock,
      },
    }),
  });

  t.snapshot(data);
  t.snapshot(authentication);
});

test("with scopes", async (t) => {
  const mock = fetchMock.sandbox().postOnce(
    "https://github.com/login/oauth/access_token",
    {
      access_token: "secret123",
      scope: "repo gist",
      token_type: "bearer",
    },
    {
      headers: {
        accept: "application/json",
        "user-agent": "test",
        "content-type": "application/json; charset=utf-8",
      },
      body: {
        client_id: "1234567890abcdef1234",
        client_secret: "1234567890abcdef12347890abcdef12345678",
        code: "code123",
      },
    }
  );

  const { data, authentication } = await exchangeWebFlowCode({
    clientType: "oauth-app",
    clientId: "1234567890abcdef1234",
    clientSecret: "1234567890abcdef12347890abcdef12345678",
    code: "code123",
    request: request.defaults({
      headers: {
        "user-agent": "test",
      },
      request: {
        fetch: mock,
      },
    }),
  });

  t.snapshot(data);
  t.snapshot(authentication);
});

test("All options for OAuth Apps", async (t) => {
  const mock = fetchMock.sandbox().postOnce(
    "https://ghe.acme-inc.com/login/oauth/access_token",
    {
      access_token: "secret123",
      scope: "",
      token_type: "bearer",
    },
    {
      headers: {
        accept: "application/json",
        "user-agent": "test",
        "content-type": "application/json; charset=utf-8",
      },
      body: {
        client_id: "1234567890abcdef1234",
        client_secret: "1234567890abcdef12347890abcdef12345678",
        code: "code123",
        redirect_uri: "https://acme-inc.com/login",
      },
    }
  );

  const { data, authentication } = await exchangeWebFlowCode({
    clientType: "oauth-app",
    clientId: "1234567890abcdef1234",
    clientSecret: "1234567890abcdef12347890abcdef12345678",
    code: "code123",
    redirectUrl: "https://acme-inc.com/login",
    request: request.defaults({
      headers: {
        "user-agent": "test",
      },
      baseUrl: "https://ghe.acme-inc.com/api/v3",
      request: {
        fetch: mock,
      },
    }),
  });

  t.snapshot(data);
  t.snapshot(authentication);
});

test("All options for GitHub Apps", async (t) => {
  const mock = fetchMock.sandbox().postOnce(
    "https://ghe.acme-inc.com/login/oauth/access_token",
    {
      access_token: "secret123",
      scope: "",
      token_type: "bearer",
    },
    {
      headers: {
        accept: "application/json",
        "user-agent": "test",
        "content-type": "application/json; charset=utf-8",
      },
      body: {
        client_id: "lv1.1234567890abcdef",
        client_secret: "1234567890abcdef12347890abcdef12345678",
        code: "code123",
        redirect_uri: "https://acme-inc.com/login",
      },
    }
  );

  const { data, authentication } = await exchangeWebFlowCode({
    clientType: "github-app",
    clientId: "lv1.1234567890abcdef",
    clientSecret: "1234567890abcdef12347890abcdef12345678",
    code: "code123",
    redirectUrl: "https://acme-inc.com/login",
    request: request.defaults({
      headers: {
        "user-agent": "test",
      },
      baseUrl: "https://ghe.acme-inc.com/api/v3",
      request: {
        fetch: mock,
      },
    }),
  });

  t.snapshot(data);
  t.snapshot(authentication);
});

test("Refresh token", async (t) => {
  const mock = fetchMock.sandbox().postOnce(
    "https://ghe.acme-inc.com/login/oauth/access_token",
    {
      body: {
        access_token: "secret123",
        scope: "",
        token_type: "bearer",
        expires_in: 28800,
        refresh_token: "r1.token123",
        refresh_token_expires_in: 15897600,
      },
      headers: {
        date: "Thu, 1 Jan 1970 00:00:00 GMT",
      },
    },
    {
      headers: {
        accept: "application/json",
        "user-agent": "test",
        "content-type": "application/json; charset=utf-8",
      },
      body: {
        client_id: "lv1.1234567890abcdef",
        client_secret: "1234567890abcdef12347890abcdef12345678",
        code: "code123",
      },
    }
  );

  const { data, authentication } = await exchangeWebFlowCode({
    clientType: "github-app",
    clientId: "lv1.1234567890abcdef",
    clientSecret: "1234567890abcdef12347890abcdef12345678",
    code: "code123",
    request: request.defaults({
      headers: {
        "user-agent": "test",
      },
      baseUrl: "https://ghe.acme-inc.com/api/v3",
      request: {
        fetch: mock,
      },
    }),
  });

  t.snapshot(data);
  t.snapshot(authentication);
});
