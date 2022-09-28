import test from "ava";

import { endpoint } from "../index.js";

test("endpoint.parse() is a function", (t) => {
  t.assert(endpoint.parse instanceof Function, "endpoint.parse is a function");
});

test("endpoint.parse() README example", (t) => {
  const input = {
    method: "GET",
    url: "/orgs/{org}/repos",
    org: "octokit",
    type: "private",
  };

  t.deepEqual(endpoint(input), endpoint.parse(endpoint.merge(input)));
});

test("endpoint.parse() defaults url to ''", (t) => {
  const { url } = endpoint.parse({
    method: "GET",
    baseUrl: "https://example.com",
    headers: {
      accept: "foo",
      "user-agent": "bar",
    },
    mediaType: {
      format: "",
      previews: [],
    },
  });

  t.deepEqual(url, "https://example.com/");
});

test("endpoint.parse() does not alter input options", (t) => {
  const input = {
    baseUrl: "https://api.github.com/v3",
    method: "GET",
    url: "/",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": "myApp v1.2.3",
    },
    mediaType: {
      format: "",
      previews: ["foo", "bar"],
    },
  };

  endpoint.parse(input);

  t.deepEqual(input.headers.accept, "application/vnd.github.v3+json");
});
