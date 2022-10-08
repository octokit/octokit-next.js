import test from "ava";
import { getUserAgent } from "universal-user-agent";

import { endpoint } from "../index.js";
import { VERSION } from "../lib/version.js";
const userAgent = `octokit-next-endpoint.js/${VERSION} ${getUserAgent()}`;

test("endpoint.merge() is a function", (t) => {
  t.assert(endpoint.merge instanceof Function, "endpoint.merge is a function");
});

test("endpoint.merge() README example", (t) => {
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

  t.deepEqual(options, {
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

test("endpoint.merge() repeated defaults", (t) => {
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

  t.deepEqual(options, {
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

test("endpoint.merge() no arguments", (t) => {
  const options = endpoint.merge();
  t.deepEqual(options, {
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

test("endpoint.merge() does not mutate the route param", (t) => {
  const route = {
    owner: "octokit",
    repo: "endpoint.js",
  };

  endpoint.merge(route);

  t.deepEqual(route, {
    owner: "octokit",
    repo: "endpoint.js",
  });
});

test("endpoint.merge() does not mutate/lowercase the headers field of route", (t) => {
  const route = {
    owner: "octokit",
    repo: "endpoint.js",
    headers: {
      "Content-Type": "application/json",
    },
  };

  endpoint.merge(route);

  t.deepEqual(route, {
    owner: "octokit",
    repo: "endpoint.js",
    headers: {
      "Content-Type": "application/json",
    },
  });
});
