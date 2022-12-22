import fetchMock from "fetch-mock";
import { request } from "@octokit/request";
import { refreshToken } from "../src";

describe("refreshToken()", () => {
  it("README example", async () => {
    const mock = fetchMock.sandbox().postOnce(
      "https://github.com/login/oauth/access_token",
      {
        body: {
          access_token: "secret456",
          scope: "",
          token_type: "bearer",
          expires_in: 28800,
          refresh_token: "r1.token456",
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
          grant_type: "refresh_token",
          refresh_token: "r1.refreshtoken123",
        },
      }
    );

    const { data, authentication } = await refreshToken({
      clientType: "github-app",
      clientId: "lv1.1234567890abcdef",
      clientSecret: "1234567890abcdef12347890abcdef12345678",
      refreshToken: "r1.refreshtoken123",
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
        "access_token": "secret456",
        "expires_in": 28800,
        "refresh_token": "r1.token456",
        "refresh_token_expires_in": 15897600,
        "scope": "",
        "token_type": "bearer",
      }
    `);
    expect(authentication).toMatchInlineSnapshot(`
      {
        "clientId": "lv1.1234567890abcdef",
        "clientSecret": "1234567890abcdef12347890abcdef12345678",
        "clientType": "github-app",
        "expiresAt": "1970-01-01T08:00:00.000Z",
        "refreshToken": "r1.token456",
        "refreshTokenExpiresAt": "1970-07-04T00:00:00.000Z",
        "token": "secret456",
      }
    `);
  });
});
