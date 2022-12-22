import fetchMock from "fetch-mock";
import { request } from "@octokit/request";
import { scopeToken } from "../src";

describe("scopeToken()", () => {
  it("README example", async () => {
    const mock = fetchMock.sandbox().postOnce(
      "https://api.github.com/applications/lv1.1234567890abcdef/token/scoped",
      {
        account: {
          login: "octokit",
          id: 1,
        },
        token: "usertoken456",
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
          access_token: "usertoken123",
          target: "octokit",
          repositories: ["oauth-methods.js"],
          permissions: { issues: "write" },
        },
      }
    );

    const { data, authentication } = await scopeToken({
      clientType: "github-app",
      clientId: "lv1.1234567890abcdef",
      clientSecret: "1234567890abcdef12347890abcdef12345678",
      token: "usertoken123",
      target: "octokit",
      repositories: ["oauth-methods.js"],
      permissions: {
        issues: "write",
      },
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
        "account": {
          "id": 1,
          "login": "octokit",
        },
        "token": "usertoken456",
      }
    `);
    expect(authentication).toMatchInlineSnapshot(`
      {
        "clientId": "lv1.1234567890abcdef",
        "clientSecret": "1234567890abcdef12347890abcdef12345678",
        "clientType": "github-app",
        "token": "usertoken456",
      }
    `);
  });

  it("passes `expires_at` through", async () => {
    const mock = fetchMock
      .sandbox()
      .postOnce(
        "https://api.github.com/applications/lv1.1234567890abcdef/token/scoped",
        {
          account: {
            login: "octokit",
            id: 1,
          },
          expires_at: "2021-10-06T17:26:27Z",
          token: "usertoken456",
        }
      );

    const { data, authentication } = await scopeToken({
      clientType: "github-app",
      clientId: "lv1.1234567890abcdef",
      clientSecret: "1234567890abcdef12347890abcdef12345678",
      token: "usertoken123",
      target: "octokit",
      repositories: ["oauth-methods.js"],
      permissions: {
        issues: "write",
      },
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
        "account": {
          "id": 1,
          "login": "octokit",
        },
        "expires_at": "2021-10-06T17:26:27Z",
        "token": "usertoken456",
      }
    `);
    expect(authentication).toMatchInlineSnapshot(`
      {
        "clientId": "lv1.1234567890abcdef",
        "clientSecret": "1234567890abcdef12347890abcdef12345678",
        "clientType": "github-app",
        "expiresAt": "2021-10-06T17:26:27Z",
        "token": "usertoken456",
      }
    `);
  });
});
