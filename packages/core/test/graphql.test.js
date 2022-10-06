import test from "ava";
import fetchMock from "fetch-mock";

import { Octokit } from "../index.js";

test("octokit.graphql() is a function", (t) => {
  const octokit = new Octokit();
  t.assert(
    octokit.graphql instanceof Function,
    "octokit.graphql instanceof Function"
  );
});

test("octokit.graphql() README usage example", async (t) => {
  const mockResult = {
    organization: {
      repositories: {
        totalCount: 123,
      },
    },
  };
  const mock = fetchMock
    .sandbox()
    .postOnce("https://api.github.com/graphql", (url, request) => {
      const body = JSON.parse(request.body.toString());
      t.deepEqual(body.query, query);

      return {
        data: mockResult,
      };
    });

  const octokit = new Octokit({
    auth: `secret123`,
    request: {
      fetch: mock,
    },
  });

  const query = `query ($login: String!) {
      organization(login: $login) {
        repositories(privacy: PRIVATE) {
          totalCount
        }
      }
    }`;

  const result = await octokit.graphql(query, { login: "octokit" });

  t.deepEqual(result, mockResult);
});

test("octokit.graphql() GitHub Enterprise Server usage (with option.baseUrl)", async (t) => {
  const mockResult = {
    organization: {
      repositories: {
        totalCount: 123,
      },
    },
  };
  const mock = fetchMock
    .sandbox()
    .postOnce("https://github.acme-inc.com/api/graphql", (url, request) => {
      const body = JSON.parse(request.body.toString());
      t.deepEqual(body.query, query);

      return {
        data: mockResult,
      };
    });

  const octokit = new Octokit({
    auth: `secret123`,
    baseUrl: "https://github.acme-inc.com/api/v3",
    request: {
      fetch: mock,
    },
  });

  const query = `query ($login: String!) {
      organization(login: $login) {
        repositories(privacy: PRIVATE) {
          totalCount
        }
      }
    }`;

  const result = await octokit.graphql(query, { login: "octokit" });

  t.deepEqual(result, mockResult);
});

test("octokit.graphql() custom headers: octokit.graphql({ query, headers })", async (t) => {
  const mock = fetchMock
    .sandbox()
    .postOnce("https://api.github.com/graphql", (url, request) => {
      t.is(request.headers["x-custom"], "value");

      return {
        data: { ok: true },
      };
    });

  const octokit = new Octokit({
    auth: `secret123`,
    request: {
      fetch: mock,
    },
  });

  const result = await octokit.graphql({
    query: "",
    headers: {
      "x-custom": "value",
    },
  });

  t.deepEqual(result, { ok: true });
});

test("octokit.graphql() custom headers: octokit.graphql(query, { headers })", async (t) => {
  const mock = fetchMock
    .sandbox()
    .postOnce("https://api.github.com/graphql", (url, request) => {
      t.is(request.headers["x-custom"], "value");

      const body = JSON.parse(request.body.toString());
      t.deepEqual(body.variables, { foo: "bar" });

      return {
        data: { ok: true },
      };
    });

  const octokit = new Octokit({
    auth: `secret123`,
    request: {
      fetch: mock,
    },
  });

  const result = await octokit.graphql("", {
    headers: {
      "x-custom": "value",
    },
    foo: "bar",
  });

  t.deepEqual(result, { ok: true });
});
