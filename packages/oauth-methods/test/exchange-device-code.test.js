import test from "ava";
import fetchMock from "fetch-mock";
import { request } from "@octokit-next/request";

import { exchangeDeviceCode } from "../index.js";

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
        device_code: "code123",
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
      },
    }
  );

  const { data, authentication } = await exchangeDeviceCode({
    clientType: "oauth-app",
    clientId: "1234567890abcdef1234",
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
        device_code: "code123",
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
      },
    }
  );

  const { data, authentication } = await exchangeDeviceCode({
    clientType: "oauth-app",
    clientId: "1234567890abcdef1234",
    code: "code123",
    scopes: ["repo", "gist"],
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

test("authorization_pending error", async (t) => {
  const mock = fetchMock.sandbox().postOnce(
    "https://github.com/login/oauth/access_token",
    {
      error: "authorization_pending",
      error_description: "error_description",
      error_uri: "error_uri",
    },
    {
      headers: {
        accept: "application/json",
        "user-agent": "test",
        "content-type": "application/json; charset=utf-8",
      },
      body: {
        client_id: "1234567890abcdef1234",
        device_code: "code123",
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
      },
    }
  );

  try {
    await exchangeDeviceCode({
      clientType: "oauth-app",
      clientId: "1234567890abcdef1234",
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
    t.fail("should not resolve");
  } catch (error) {
    t.snapshot(error);
  }
});

test("OAuth App with ClientSecret", async (t) => {
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
        device_code: "code123",
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
      },
    }
  );

  const { data, authentication } = await exchangeDeviceCode({
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

test("GitHub App", async (t) => {
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
        client_id: "lv1.1234567890abcdef",
        device_code: "code123",
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
      },
    }
  );

  const { data, authentication } = await exchangeDeviceCode({
    clientType: "github-app",
    clientId: "lv1.1234567890abcdef",
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

test("GitHub App with clientSecret", async (t) => {
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
        client_id: "lv1.1234567890abcdef",
        device_code: "code123",
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
      },
    }
  );

  const { data, authentication } = await exchangeDeviceCode({
    clientType: "github-app",
    clientId: "lv1.1234567890abcdef",
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

test("Refresh token", async (t) => {
  const mock = fetchMock.sandbox().postOnce(
    "https://github.com/login/oauth/access_token",
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
        device_code: "code123",
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
      },
    }
  );

  const { data, authentication } = await exchangeDeviceCode({
    clientType: "github-app",
    clientId: "lv1.1234567890abcdef",
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
