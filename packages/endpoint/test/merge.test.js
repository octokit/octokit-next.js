import { suite } from "uvu";
import * as assert from "uvu/assert";
import { getUserAgent } from "universal-user-agent";

import { endpoint } from "../index.js";
import { VERSION } from "../lib/version.js";
const userAgent = `octokit-endpoint.js/${VERSION} ${getUserAgent()}`;

const test = suite("endpoint.merge()");

test("is a function", () => {
  assert.instance(endpoint.merge, Function, "endpoint.merge is a function");
});

test("README example", () => {
  const myProjectEndpoint = endpoint.defaults({
    baseUrl: "https://github-enterprise.acme-inc.com/api/v3",
    headers: {
      "user-agent": "myApp/1.2.3",
    },
    org: "my-project",
  });
  const options = myProjectEndpoint.merge("GET /orgs/{org}/repos", {
    headers: {
      authorization: `token 0000000000000000000000000000000000000001`,
    },
    type: "private",
  });

  assert.equal(options, {
    baseUrl: "https://github-enterprise.acme-inc.com/api/v3",
    mediaType: {
      format: "",
      previews: [],
    },
    method: "GET",
    url: "/orgs/{org}/repos",
    headers: {
      accept: "application/vnd.github.v3+json",
      authorization: `token 0000000000000000000000000000000000000001`,
      "user-agent": "myApp/1.2.3",
    },
    org: "my-project",
    type: "private",
  });
});

test("repeated defaults", () => {
  const myProjectEndpoint = endpoint.defaults({
    baseUrl: "https://github-enterprise.acme-inc.com/api/v3",
    headers: {
      "user-agent": "myApp/1.2.3",
    },
    org: "my-project",
  });
  const myProjectEndpointWithAuth = myProjectEndpoint.defaults({
    headers: {
      authorization: `token 0000000000000000000000000000000000000001`,
    },
  });

  const options = myProjectEndpointWithAuth.merge(`GET /orgs/{org}/repos`);

  assert.equal(options, {
    baseUrl: "https://github-enterprise.acme-inc.com/api/v3",
    mediaType: {
      format: "",
      previews: [],
    },
    method: "GET",
    url: "/orgs/{org}/repos",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": "myApp/1.2.3",
      authorization: `token 0000000000000000000000000000000000000001`,
    },
    org: "my-project",
  });
});

test("no arguments", () => {
  const options = endpoint.merge();
  assert.equal(options, {
    baseUrl: "https://api.github.com",
    mediaType: {
      format: "",
      previews: [],
    },
    method: "GET",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent,
    },
  });
});

test("does not mutate the route param", () => {
  const route = {
    owner: "octokit",
    repo: "endpoint.js",
  };

  endpoint.merge(route);

  assert.equal(route, {
    owner: "octokit",
    repo: "endpoint.js",
  });
});

test("does not mutate/lowercase the headers field of route", () => {
  const route = {
    owner: "octokit",
    repo: "endpoint.js",
    headers: {
      "Content-Type": "application/json",
    },
  };

  endpoint.merge(route);

  assert.equal(route, {
    owner: "octokit",
    repo: "endpoint.js",
    headers: {
      "Content-Type": "application/json",
    },
  });
});

test.run();
