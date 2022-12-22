import test from "ava";
import fetchMock from "fetch-mock";
import { request } from "@octokit-next/request";

import { createDeviceCode } from "../index.js";

test("README example", async (t) => {
  const mock = fetchMock.sandbox().postOnce(
    "https://github.com/login/device/code",
    {
      device_code: "devicecode123",
      user_code: "usercode123",
      verification_uri: "https://github.com/login/device",
      expires_in: 900,
      interval: 5,
    },
    {
      headers: {
        accept: "application/json",
        "user-agent": "test",
        "content-type": "application/json; charset=utf-8",
      },
      body: {
        client_id: "1234567890abcdef1234",
        scope: "repo",
      },
    }
  );

  const { data } = await createDeviceCode({
    clientType: "oauth-app",
    clientId: "1234567890abcdef1234",
    scopes: ["repo"],
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
});

test("GitHub App example", async (t) => {
  const mock = fetchMock.sandbox().postOnce(
    "https://github.com/login/device/code",
    {
      device_code: "devicecode123",
      user_code: "usercode123",
      verification_uri: "https://github.com/login/device",
      expires_in: 900,
      interval: 5,
    },
    {
      headers: {
        accept: "application/json",
        "user-agent": "test",
        "content-type": "application/json; charset=utf-8",
      },
      body: {
        client_id: "lv1.1234567890abcdef",
      },
    }
  );

  const { data } = await createDeviceCode({
    clientType: "github-app",
    clientId: "lv1.1234567890abcdef",
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
});
