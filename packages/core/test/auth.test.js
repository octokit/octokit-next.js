import test from "ava";
import fetchMock from "fetch-mock";
import sinon from "sinon";

import { Octokit } from "../index.js";

// overide default user agent for testing
Octokit.DEFAULTS.userAgent = "<TESTING>";
const userAgent = `<TESTING>`;

const testAuth = Object.assign(
  async (strategyOptions, authOptions) => {
    return { type: "test", strategyOptions, authOptions };
  },
  {
    async hook(request, route, parameters) {
      return request(route, parameters);
    },
  }
);
const createTestAuth = (strategyOptions) =>
  Object.assign(testAuth.bind(null, strategyOptions), {
    hook: testAuth.hook,
  });

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

test("auth = createTestAuth()", async (t) => {
  const mock = fetchMock.sandbox().getOnce(
    "https://api.github.com/",
    { ok: true },
    {
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
    }
  );

  const MyOctokit = Octokit.withDefaults({
    authStrategy: createTestAuth,
    request: {
      fetch: mock,
    },
  });

  const octokit = new MyOctokit({
    auth: {
      strategy: 1,
    },
  });

  await octokit.request("GET /");

  t.is(mock.done(), true);
});

// TODO: enable once `createAppAuth` is ESM-ified.

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

test("should pass through the logger (#1277)", async (t) => {
  const myLog = {
    debug: sinon.stub(),
    info: sinon.stub(),
    warn: sinon.stub(),
    error: sinon.stub(),
  };

  const octokit = new Octokit({
    log: myLog,
    authStrategy: createTestAuth,
    auth: {
      foo: "bar",
    },
  });

  const authentication = await octokit.auth();
  t.deepEqual(authentication.strategyOptions.log, myLog);
});

test("should pass octokit and octokitOptions if a custom authStrategy was set", async (t) => {
  const octokit = new Octokit({
    authStrategy: createTestAuth,
    auth: {
      foo: "bar",
    },
    someUnrelatedOption: "value",
  });

  const authentication = await octokit.auth();

  t.deepEqual(Object.keys(authentication.strategyOptions).sort(), [
    "foo",
    "log",
    "octokit",
    "octokitOptions",
    "request",
  ]);
  const { auth, someUnrelatedOption } =
    authentication.strategyOptions.octokitOptions;
  t.deepEqual(
    { auth, someUnrelatedOption },
    {
      auth: {
        foo: "bar",
      },
      someUnrelatedOption: "value",
    }
  );
});
