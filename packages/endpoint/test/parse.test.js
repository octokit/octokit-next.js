import { suite } from "uvu";
import * as assert from "uvu/assert";

import { endpoint } from "../index.js";

const test = suite("endpoint.parse()");

test("is a function", () => {
  assert.instance(endpoint.parse, Function, "endpoint.parse is a function");
});

test("README example", () => {
  const input = {
    method: "GET",
    url: "/orgs/{org}/repos",
    org: "octokit",
    type: "private",
  };

  assert.equal(endpoint(input), endpoint.parse(endpoint.merge(input)));
});

test("defaults url to ''", () => {
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
  assert.equal(url, "https://example.com/");
});

test("does not alter input options", () => {
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

  assert.equal(input.headers.accept, "application/vnd.github.v3+json");
});

test.run();
