import test from "ava";
import { getUserAgent } from "universal-user-agent";
import fetchMock from "fetch-mock";
import sinon from "sinon";

import { Octokit } from "../index.js";

const userAgent = `octokit-core.js/0.0.0-development ${getUserAgent()}`;

test("new Octokit({ auth: 'secret123' })", async (t) => {
  const mock = fetchMock.sandbox().getOnce(
    "https://api.github.com/",
    { ok: true },
    {
      headers: {
        accept: "application/vnd.github.v3+json",
        authorization: "token secret123",
        "user-agent": userAgent,
      },
    }
  );

  const octokit = new Octokit({
    auth: "secret123",
    request: {
      fetch: mock,
    },
  });

  await t.notThrowsAsync(() => octokit.request("/"));
});

test("new Octokit({ auth: 'token secret123' })", async (t) => {
  const mock = fetchMock.sandbox().getOnce(
    "https://api.github.com/",
    { ok: true },
    {
      headers: {
        accept: "application/vnd.github.v3+json",
        authorization: "token secret123",
        "user-agent": userAgent,
      },
    }
  );

  const octokit = new Octokit({
    auth: "token secret123",
    request: {
      fetch: mock,
    },
  });

  await t.notThrowsAsync(() => octokit.request("/"));
});

test("new Octokit({ auth: 'Token secret123' })", async (t) => {
  const mock = fetchMock.sandbox().getOnce(
    "https://api.github.com/",
    { ok: true },
    {
      headers: {
        accept: "application/vnd.github.v3+json",
        authorization: "token secret123",
        "user-agent": userAgent,
      },
    }
  );

  const octokit = new Octokit({
    auth: "Token secret123",
    request: {
      fetch: mock,
    },
  });

  await t.notThrowsAsync(() => octokit.request("/"));
});

const BEARER_TOKEN =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NTM4MTkzMTIsImV4cCI6MTU1MzgxOTM3MiwiaXNzIjoxfQ.etiSZ4LFQZ8tiMGJVqKDoGn8hxMCgwL4iLvU5xBUqbAPr4pbk_jJZmMQjuxTlOnRxq4e7NouTizGCdfohRMb3R1mpLzGPzOH9_jqSA_BWYxolsRP_WDSjuNcw6nSxrPRueMVRBKFHrqcTOZJej0djRB5pI61hDZJ_-DGtiOIFexlK3iuVKaqBkvJS5-TbTekGuipJ652g06gXuz-l8i0nHiFJldcuIruwn28hTUrjgtPbjHdSBVn_QQLKc2Fhij8OrhcGqp_D_fvb_KovVmf1X6yWiwXV5VXqWARS-JGD9JTAr2495ZlLV_E4WPxdDpz1jl6XS9HUhMuwBpaCOuipw";
test("new Octokit({ auth: BEARER_TOKEN })", async (t) => {
  const mock = fetchMock.sandbox().getOnce(
    "https://api.github.com/",
    { ok: true },
    {
      headers: {
        accept: "application/vnd.github.v3+json",
        authorization: `bearer ${BEARER_TOKEN}`,
        "user-agent": userAgent,
      },
    }
  );

  const octokit = new Octokit({
    auth: BEARER_TOKEN,
    request: {
      fetch: mock,
    },
  });

  await t.notThrowsAsync(() => octokit.request("/"));
});

test("octokit.auth() is noop by default", async (t) => {
  const octokit = new Octokit();
  const result = await octokit.auth();
  t.deepEqual(result, { type: "unauthenticated" });
});

test("octokit.auth() with options.auth = secret", async (t) => {
  const octokit = new Octokit({
    auth: "secret",
  });
  const result = await octokit.auth();
  t.deepEqual(result, {
    type: "token",
    tokenType: "oauth",
    token: "secret",
  });
});

// TOOD: implement the tests below

// test("auth = createOAuthAppAuth()", async (t) => {
//   const CLIENT_ID = "0123";
//   const CLIENT_SECRET = "0123secret";
//   const CODE = "code123";
//   const STATE = "state123";

//   const mock = fetchMock.sandbox().postOnce(
//     "https://github.com/login/oauth/access_token",
//     {
//       access_token: "token123",
//       scope: "",
//       token_type: "bearer",
//     },
//     {
//       body: {
//         client_id: CLIENT_ID,
//         client_secret: CLIENT_SECRET,
//         code: CODE,
//         state: STATE,
//       },
//     }
//   );

//   const MyOctokit = Octokit.defaults({
//     authStrategy: createOAuthAppAuth,
//     request: {
//       fetch: mock,
//     },
//   });

//   const octokit = new MyOctokit({
//     auth: {
//       clientId: CLIENT_ID,
//       clientSecret: CLIENT_SECRET,
//     },
//   });

//   await octokit.auth({
//     type: "oauth-user",
//     code: CODE,
//     state: STATE,
//   });

//   t.is(mock.done(), true);
// });

// test("auth = createAppAuth()", async (t) => {
//   const mock = fetchMock
//     .sandbox()
//     .postOnce("https://api.github.com/app/installations/123/access_tokens", {
//       token: "secret123",
//       expires_at: "1970-01-01T01:00:00.000Z",
//       permissions: {
//         metadata: "read",
//       },
//       repository_selection: "all",
//     })
//     .get(
//       "https://api.github.com/repos/octocat/hello-world",
//       { id: 123 },
//       {
//         headers: {
//           authorization: "token secret123",
//         },
//         repeat: 2,
//       }
//     )
//     .getOnce(
//       "https://api.github.com/app",
//       { id: 123 },
//       {
//         headers: {
//           accept: "application/vnd.github.machine-man-preview+json",
//           "user-agent": userAgent,
//           authorization: `bearer ${BEARER}`,
//         },
//       }
//     );

//   const octokit = new Octokit({
//     authStrategy: createAppAuth,
//     auth: {
//       appId: APP_ID,
//       privateKey: PRIVATE_KEY,
//       installationId: 123,
//     },
//     request: {
//       fetch: mock,
//     },
//   });

//   await octokit.request("GET /repos/octocat/hello-world");
//   await octokit.request("GET /repos/octocat/hello-world");

//   await octokit.request("GET /app", {
//     mediaType: {
//       previews: ["machine-man"],
//     },
//   });

//   t.is(mock.done(), true);
// });

// test("auth = createActionAuth()", async (t) => {
//   const mock = fetchMock.sandbox().getOnce(
//     "https://api.github.com/app",
//     { id: 123 },
//     {
//       headers: {
//         accept: "application/vnd.github.v3+json",
//         authorization: `token githubtoken123`,
//         "user-agent": userAgent,
//       },
//     }
//   );
//   const currentEnv = process.env;
//   process.env = {
//     GITHUB_ACTION: "1",
//     GITHUB_TOKEN: "githubtoken123",
//   };

//   const octokit = new Octokit({
//     authStrategy: createActionAuth,
//     request: {
//       fetch: mock,
//     },
//   });

//   await octokit.request("/app");
//   process.env = currentEnv;
// });

// test("createAppAuth with GraphQL + GHES (probot/probot#1386)", async (t) => {
//   const mock = fetchMock
//     .sandbox()
//     .postOnce(
//       "https://fake.github-enterprise.com/api/v3/app/installations/123/access_tokens",
//       {
//         token: "secret123",
//         expires_at: "1970-01-01T01:00:00.000Z",
//         permissions: {
//           metadata: "read",
//         },
//         repository_selection: "all",
//       }
//     )
//     .postOnce(
//       "https://fake.github-enterprise.com/api/graphql",
//       { ok: true },
//       {
//         headers: {
//           authorization: "token secret123",
//         },
//       }
//     );

//   const octokit = new Octokit({
//     authStrategy: createAppAuth,
//     auth: {
//       appId: APP_ID,
//       privateKey: PRIVATE_KEY,
//       installationId: 123,
//     },
//     baseUrl: "https://fake.github-enterprise.com/api/v3",
//     request: {
//       fetch: mock,
//     },
//   });

//   await octokit.graphql(`query {
//       viewer {
//         login
//       }
//     }`);

//   t.is(mock.done(), true);
// });

// test("should pass through the logger (#1277)", async (t) => {
//   const mock = fetchMock
//     .sandbox()
//     .postOnce("https://api.github.com/app/installations/2/access_tokens", {
//       token: "installation-token-123",
//       permissions: {},
//     })
//     .getOnce("https://api.github.com/repos/octokit/core.js", 401)
//     .getOnce(
//       "https://api.github.com/repos/octokit/core.js",
//       { ok: true },
//       { overwriteRoutes: false }
//     );

//   const mockWarnLogger = jest.fn();

//   const octokit = new Octokit({
//     log: {
//       debug: jest.fn(),
//       info: jest.fn(),
//       warn: mockWarnLogger,
//       error: jest.fn(),
//     },
//     authStrategy: createAppAuth,
//     auth: {
//       appId: 1,
//       privateKey: PRIVATE_KEY,
//       installationId: 2,
//     },
//     request: {
//       fetch: mock,
//     },
//   });

//   await octokit.request("GET /repos/octokit/core.js");

//   t.is(mockWarnLogger.mock.calls.length, 1);
//   t.is(
//     mockWarnLogger.mock.calls[0][0],
//     "[@octokit/auth-app] Retrying after 401 response to account for token replication delay (retry: 1, wait: 1s)"
//   );
// });

// test("should pass octokit and octokitOptions if a custom authStrategy was set", async (t) => {
//   const authStrategy = jest.fn().mockReturnValue({
//     hook() {},
//   });
//   new Octokit({
//     authStrategy,
//     auth: {
//       secret: "123",
//     },
//     someUnrelatedOption: "value",
//   });

//   const strategyOptions = authStrategy.mock.calls[0][0];

//   t.deepEqual(Object.keys(strategyOptions).sort(), [
//     "log",
//     "octokit",
//     "octokitOptions",
//     "request",
//     "secret",
//   ]);
//   t.deepEqual(strategyOptions.octokitOptions, {
//     auth: {
//       secret: "123",
//     },
//     someUnrelatedOption: "value",
//   });
// });
