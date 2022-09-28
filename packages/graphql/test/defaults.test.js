import test from "ava";

import fetchMock from "fetch-mock";
import { getUserAgent } from "universal-user-agent";

import { VERSION } from "../version.js";
import { graphql } from "../index.js";

const userAgent = `octokit-graphql.js/${VERSION} ${getUserAgent()}`;

test("graphql.defaults() is a function", (t) => {
  t.assert(graphql.defaults instanceof Function);
});

test("graphql.defaults() README example", (t) => {
  const mockData = {
    repository: {
      issues: {
        edges: [
          {
            node: {
              title: "Foo",
            },
          },
          {
            node: {
              title: "Bar",
            },
          },
          {
            node: {
              title: "Baz",
            },
          },
        ],
      },
    },
  };

  const authenticatedGraphql = graphql.defaults({
    headers: {
      authorization: `token secret123`,
    },
    request: {
      fetch: fetchMock.sandbox().post(
        "https://api.github.com/graphql",
        { data: mockData },
        {
          headers: {
            authorization: "token secret123",
          },
        }
      ),
    },
  });
  return authenticatedGraphql(`{
      repository(owner:"octokit", name:"graphql.js") {
        issues(last:3) {
          edges {
            node {
              title
            }
          }
        }
      }
    }`).then((result) => {
    t.deepEqual(result, mockData);
  });
});

test("graphql.defaults() repeated defaults", (t) => {
  const mockData = {
    repository: {
      issues: {
        edges: [
          {
            node: {
              title: "Foo",
            },
          },
          {
            node: {
              title: "Bar",
            },
          },
          {
            node: {
              title: "Baz",
            },
          },
        ],
      },
    },
  };

  const authenticatedGraphql = graphql.defaults({
    headers: {
      authorization: `token secret123`,
    },
    request: {
      fetch: fetchMock.sandbox().post(
        "https://github.acme-inc.com/api/graphql",
        { data: mockData },
        {
          headers: {
            authorization: "token secret123",
          },
        }
      ),
    },
  });
  const acmeGraphql = authenticatedGraphql.defaults({
    baseUrl: "https://github.acme-inc.com/api",
  });
  return acmeGraphql(`{
      repository(owner:"octokit", name:"graphql.js") {
        issues(last:3) {
          edges {
            node {
              title
            }
          }
        }
      }
    }`).then((result) => {
    t.deepEqual(result, mockData);
  });
});

test("graphql.defaults() handle baseUrl set with /api/v3 suffix", async (t) => {
  const ghesGraphQl = graphql.defaults({
    baseUrl: "https://github.acme-inc.com/api/v3",
    headers: {
      authorization: `token secret123`,
    },
    request: {
      fetch: fetchMock.sandbox().post(
        "https://github.acme-inc.com/api/graphql",
        { data: { ok: true } },
        {
          headers: {
            authorization: "token secret123",
          },
        }
      ),
    },
  });

  await t.notThrowsAsync(() =>
    ghesGraphQl(`query {
      viewer {
        login
      }
    }`)
  );
});

test("graphql.defaults() set defaults on .endpoint", (t) => {
  const mockData = {
    repository: {
      issues: {
        edges: [
          {
            node: {
              title: "Foo",
            },
          },
          {
            node: {
              title: "Bar",
            },
          },
          {
            node: {
              title: "Baz",
            },
          },
        ],
      },
    },
  };

  const authenticatedGraphql = graphql.defaults({
    headers: {
      authorization: `token secret123`,
    },
    request: {
      fetch: fetchMock.sandbox().post(
        "https://github.acme-inc.com/api/graphql",
        { data: mockData },
        {
          headers: {
            authorization: "token secret123",
          },
        }
      ),
    },
  });

  const { request: _request, ...requestOptions } =
    // @ts-expect-error - TODO: expects to set { url } but it really shouldn't
    authenticatedGraphql.endpoint();
  t.deepEqual(requestOptions, {
    method: "POST",
    url: "https://api.github.com/graphql",
    headers: {
      accept: "application/vnd.github.v3+json",
      authorization: "token secret123",
      "user-agent": userAgent,
      "content-length": 0,
    },
  });
});
