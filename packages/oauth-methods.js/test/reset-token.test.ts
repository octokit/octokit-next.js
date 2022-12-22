import fetchMock from "fetch-mock";
import { request } from "@octokit/request";
import { resetToken } from "../src";

describe("resetToken()", () => {
  it("README example", async () => {
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

    expect(data).toMatchInlineSnapshot(`
      {
        "scopes": [
          "repo",
        ],
        "token": "token456",
      }
    `);
    expect(authentication).toMatchInlineSnapshot(`
      {
        "clientId": "1234567890abcdef1234",
        "clientSecret": "1234567890abcdef12347890abcdef12345678",
        "clientType": "oauth-app",
        "scopes": [
          "repo",
        ],
        "token": "token456",
      }
    `);
  });

  it("GitHub Example", async () => {
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

    expect(data).toMatchInlineSnapshot(`
      {
        "expires_at": "2021-10-06T17:26:27Z",
        "scopes": [],
        "token": "token456",
      }
    `);
    expect(authentication).toMatchInlineSnapshot(`
      {
        "clientId": "lv1.1234567890abcdef",
        "clientSecret": "1234567890abcdef12347890abcdef12345678",
        "clientType": "github-app",
        "expiresAt": "2021-10-06T17:26:27Z",
        "token": "token456",
      }
    `);
  });
});
