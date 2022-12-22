import fetchMock from "fetch-mock";
import { request } from "@octokit/request";
import { deleteAuthorization } from "../src";

describe("deleteAuthorization()", () => {
  it("README example", async () => {
    const mock = fetchMock.sandbox().deleteOnce(
      "https://api.github.com/applications/1234567890abcdef1234/grant",
      {
        status: 204,
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

    const response = await deleteAuthorization({
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

    expect(response).toMatchInlineSnapshot(`
      {
        "data": undefined,
        "headers": {},
        "status": 204,
        "url": "https://api.github.com/applications/1234567890abcdef1234/grant",
      }
    `);
  });

  it("GitHub App", async () => {
    const mock = fetchMock.sandbox().deleteOnce(
      "https://api.github.com/applications/lv1.1234567890abcdef/grant",
      {
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

    const response = await deleteAuthorization({
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

    expect(response).toMatchInlineSnapshot(`
      {
        "data": {
          "scopes": [],
          "token": "token456",
        },
        "headers": {
          "content-length": "32",
          "content-type": "application/json",
        },
        "status": 200,
        "url": "https://api.github.com/applications/lv1.1234567890abcdef/grant",
      }
    `);
  });
});
