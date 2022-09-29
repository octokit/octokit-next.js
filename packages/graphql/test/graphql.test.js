import test from "ava";
import fetchMock from "fetch-mock";
import { getUserAgent } from "universal-user-agent";

import { graphql, VERSION } from "../index.js";

const userAgent = `octokit-next-graphql.js/${VERSION} ${getUserAgent()}`;

test("graphql() is a function", (t) => {
  t.assert(graphql instanceof Function);
});

test("graphql() README simple query example", (t) => {
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

  return graphql(
    `
      {
        repository(owner: "octokit", name: "graphql.js") {
          issues(last: 3) {
            edges {
              node {
                title
              }
            }
          }
        }
      }
    `,
    {
      headers: {
        authorization: `token secret123`,
      },
      request: {
        fetch: fetchMock.sandbox().post(
          "https://api.github.com/graphql",
          { data: mockData },
          {
            headers: {
              accept: "application/vnd.github.v3+json",
              authorization: "token secret123",
              "user-agent": userAgent,
            },
          }
        ),
      },
    }
  ).then((result) => {
    t.deepEqual(result, mockData);
  });
});

test("graphql() Variables", (t) => {
  const query = `query lastIssues($owner: String!, $repo: String!, $num: Int = 3) {
      repository(owner:$owner, name:$repo) {
        issues(last:$num) {
          edges {
            node {
              title
            }
          }
        }
      }
    }`;

  return graphql(query, {
    headers: {
      authorization: `token secret123`,
    },
    owner: "octokit",
    repo: "graphql.js",
    request: {
      fetch: fetchMock
        .sandbox()
        .post("https://api.github.com/graphql", (url, options) => {
          const body = JSON.parse(options.body);
          t.deepEqual(body.query, query);
          t.deepEqual(body.variables, {
            owner: "octokit",
            repo: "graphql.js",
          });

          return { data: {} };
        }),
    },
  });
});

test("graphql() Pass headers together with variables as 2nd argument", (t) => {
  const query = `query lastIssues($owner: String!, $repo: String!, $num: Int = 3) {
      repository(owner:$owner, name:$repo) {
        issues(last:$num) {
          edges {
            node {
              title
            }
          }
        }
      }
    }`;

  const options = {
    headers: {
      authorization: `token secret123`,
      "x-custom": "value",
    },
    owner: "octokit",
    repo: "graphql.js",
    request: {
      fetch: fetchMock
        .sandbox()
        .post("https://api.github.com/graphql", (url, options) => {
          const body = JSON.parse(options.body);
          t.deepEqual(body.query, query);
          t.deepEqual(body.variables, {
            owner: "octokit",
            repo: "graphql.js",
          });
          t.deepEqual(options.headers["authorization"], "token secret123");
          t.deepEqual(options.headers["x-custom"], "value");

          return { data: {} };
        }),
    },
  };

  return graphql(query, options);
});

test("graphql() Pass query together with headers and variables", (t) => {
  const query = `query lastIssues($owner: String!, $repo: String!, $num: Int = 3) {
      repository(owner:$owner, name:$repo) {
        issues(last:$num) {
          edges {
            node {
              title
            }
          }
        }
      }
    }`;

  const options = {
    headers: {
      authorization: `token secret123`,
    },
    owner: "octokit",
    query,
    repo: "graphql.js",
    request: {
      fetch: fetchMock
        .sandbox()
        .post("https://api.github.com/graphql", (url, options) => {
          const body = JSON.parse(options.body);
          t.deepEqual(body.query, query);
          t.deepEqual(body.variables, {
            owner: "octokit",
            repo: "graphql.js",
          });

          return { data: {} };
        }),
    },
  };

  return graphql(options);
});

test("graphql() Don’t send empty variables object", (t) => {
  const query = "{ viewer { login } }";

  return graphql(query, {
    headers: {
      authorization: `token secret123`,
    },
    request: {
      fetch: fetchMock
        .sandbox()
        .post("https://api.github.com/graphql", (url, options) => {
          const body = JSON.parse(options.body);
          t.deepEqual(body.query, query);
          t.deepEqual(body.variables, undefined);

          return { data: {} };
        }),
    },
  });
});

test("graphql() MediaType previews are added to header", (t) => {
  const query = `{ viewer { login } }`;

  return graphql(query, {
    headers: {
      authorization: `token secret123`,
    },
    owner: "octokit",
    repo: "graphql.js",
    mediaType: { previews: ["antiope", "testpkg"] },
    request: {
      fetch: fetchMock
        .sandbox()
        .post("https://api.github.com/graphql", (url, options) => {
          t.regex(options.headers.accept, /antiope-preview/);
          t.regex(options.headers.accept, /testpkg-preview/);
          return { data: {} };
        }),
    },
  });
});

test("graphql() query variable (#166)", (t) => {
  const query = `query search($query: String!) {
      search(query: $query, first: 10, type: ISSUE) {
        edges {
          node {
            ... on PullRequest {
              title
            }
          }
        }
      }
    }`;

  return graphql(query, {
    headers: {
      authorization: `token secret123`,
    },
    query: "test",
  })
    .then(() => {
      t.fail("should not resolve");
    })
    .catch((error) => {
      t.deepEqual(
        error.message,
        `[@octokit/graphql] "query" cannot be used as variable name`
      );
    });
});

test("graphql() url variable (#264)", (t) => {
  const query = `query GetCommitStatus($url: URI!) {
      resource(url: $url) {
        ... on Commit {
          status {
            state
          }
        }
      }
    }`;

  return graphql(query, {
    url: "https://example.com",
  })
    .then(() => {
      t.fail("should not resolve");
    })
    .catch((error) => {
      t.deepEqual(
        error.message,
        `[@octokit/graphql] "url" cannot be used as variable name`
      );
    });
});

test("graphql() method variable", (t) => {
  const query = `query($method:String!){
      search(query:$method,type:ISSUE) {
        codeCount
      }
    }`;

  return graphql(query, {
    method: "test",
  })
    .then(() => {
      t.fail("should not resolve");
    })
    .catch((error) => {
      t.deepEqual(
        error.message,
        `[@octokit/graphql] "method" cannot be used as variable name`
      );
    });
});
