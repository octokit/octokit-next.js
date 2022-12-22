import test from "ava";
import fetchMock from "fetch-mock";
import { request } from "@octokit-next/request";

import { resetToken } from "../index.js";

test("README example", async (t) => {
  const mock = fetchMock.sandbox().patchOnce(
    "https://api.github.com/applications/1234567890abcdef1234/token",
    {
      scopes: ["repo"],
      token: "token456",
    },
    {
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": "test",
        authorization:
          "basic MTIzNDU2Nzg5MGFiY2RlZjEyMzQ6MTIzNDU2Nzg5MGFiY2RlZjEyMzQ3ODkwYWJjZGVmMTIzNDU2Nzg=",
        "content-type": "application/json; charset=utf-8",
      },
      body: {
        access_token: "token123",
      },
    }
  );

  const { data, authentication } = await resetToken({
    clientType: "oauth-app",
    clientId: "1234567890abcdef1234",
    clientSecret: "1234567890abcdef12347890abcdef12345678",
    token: "token123",
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

test("GitHub Example", async (t) => {
  const mock = fetchMock.sandbox().patchOnce(
    "https://api.github.com/applications/lv1.1234567890abcdef/token",
    {
      expires_at: "2021-10-06T17:26:27Z",
      scopes: [],
      token: "token456",
    },
    {
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": "test",
        authorization:
          "basic bHYxLjEyMzQ1Njc4OTBhYmNkZWY6MTIzNDU2Nzg5MGFiY2RlZjEyMzQ3ODkwYWJjZGVmMTIzNDU2Nzg=",
        "content-type": "application/json; charset=utf-8",
      },
      body: {
        access_token: "token123",
      },
    }
  );

  const { data, authentication } = await resetToken({
    clientType: "github-app",
    clientId: "lv1.1234567890abcdef",
    clientSecret: "1234567890abcdef12347890abcdef12345678",
    token: "token123",
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
