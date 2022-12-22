import { request } from "@octokit/request";
import { getWebFlowAuthorizationUrl } from "../src";

describe("getWebFlowAuthorizationUrl()", () => {
  it("README example", () => {
    const { url } = getWebFlowAuthorizationUrl({
      clientType: "oauth-app",
      clientId: "1234567890abcdef1234",
      scopes: ["repo"],
      state: "state123",
    });

    expect(url).toEqual(
      "https://github.com/login/oauth/authorize?allow_signup=true&client_id=1234567890abcdef1234&scope=repo&state=state123"
    );
  });

  it("all options for OAuth Apps", () => {
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

    expect(result).toMatchInlineSnapshot(`
      {
        "allowSignup": false,
        "clientId": "1234567890abcdef1234",
        "clientType": "oauth-app",
        "login": "octocat",
        "redirectUrl": "https://acme-inc.com/login",
        "scopes": [
          "repo",
        ],
        "state": "state123",
        "url": "https://ghe.acme-inc.com/login/oauth/authorize?allow_signup=false&client_id=1234567890abcdef1234&login=octocat&redirect_uri=https%3A%2F%2Facme-inc.com%2Flogin&scope=repo&state=state123",
      }
    `);
  });

  it("all options for GitHub Apps", () => {
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

    expect(result).toMatchInlineSnapshot(`
      {
        "allowSignup": false,
        "clientId": "lv1.1234567890abcdef",
        "clientType": "github-app",
        "login": "octocat",
        "redirectUrl": "https://acme-inc.com/login",
        "state": "state123",
        "url": "https://ghe.acme-inc.com/login/oauth/authorize?allow_signup=false&client_id=lv1.1234567890abcdef&login=octocat&redirect_uri=https%3A%2F%2Facme-inc.com%2Flogin&state=state123",
      }
    `);
  });
});
