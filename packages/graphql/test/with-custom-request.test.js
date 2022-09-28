import test from "ava";
import fetchMock from "fetch-mock";
import { request } from "@octokit-next/request";

import { withCustomRequest } from "../index.js";

test("withCustomRequest() README example", (t) => {
  const myRequest = request.defaults({
    headers: {
      authorization: "token secret123",
      "user-agent": "test",
    },
  });
  const myGraphql = withCustomRequest(myRequest);

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

  return myGraphql(
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
              "user-agent": "test",
            },
          }
        ),
      },
    }
  ).then((result) => {
    t.deepEqual(result, mockData);
  });
});
