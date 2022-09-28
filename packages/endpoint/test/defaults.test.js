import test from "ava";

import { endpoint } from "../index.js";

test("endpoint.defaults() is a function", (t) => {
  t.assert(
    endpoint.defaults instanceof Function,
    "endpoint.defaults() is a function"
  );
});

test("endpoint.defaults() README example", (t) => {
  const myEndpoint = endpoint.defaults({
    baseUrl: "https://github-enterprise.acme-inc.com/api/v3",
    headers: {
      "user-agent": "myApp/1.2.3",
      authorization: `token 0000000000000000000000000000000000000001`,
    },
    org: "my-project",
    per_page: 100,
  });

  const options = myEndpoint(`GET /orgs/{org}/repos`);

  t.deepEqual(options, {
    method: "GET",
    url: "https://github-enterprise.acme-inc.com/api/v3/orgs/my-project/repos?per_page=100",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": "myApp/1.2.3",
      authorization: `token 0000000000000000000000000000000000000001`,
    },
  });
});

test("endpoint.defaults() repeated defaults", (t) => {
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

  const options = myProjectEndpointWithAuth(`GET /orgs/{org}/repos`);

  t.deepEqual(options, {
    method: "GET",
    url: "https://github-enterprise.acme-inc.com/api/v3/orgs/my-project/repos",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": "myApp/1.2.3",
      authorization: `token 0000000000000000000000000000000000000001`,
    },
  });
});

test("endpoint.defaults().DEFAULTS", (t) => {
  t.deepEqual(endpoint.DEFAULTS.baseUrl, "https://api.github.com");
  const myEndpoint = endpoint.defaults({
    baseUrl: "https://github-enterprise.acme-inc.com/api/v3",
  });
  t.deepEqual(
    myEndpoint.DEFAULTS.baseUrl,
    "https://github-enterprise.acme-inc.com/api/v3"
  );
});

test("endpoint.defaults() merges options but does not yet parse", (t) => {
  const myEndpoint = endpoint.defaults({
    url: "/orgs/{org}",
    org: "test1",
  });
  t.deepEqual(myEndpoint.DEFAULTS.url, "/orgs/{org}");
  t.deepEqual(myEndpoint.DEFAULTS.org, "test1");
  const myEndpoint2 = myEndpoint.defaults({
    url: "/orgs/{org}",
    org: "test2",
  });
  t.deepEqual(myEndpoint2.DEFAULTS.url, "/orgs/{org}");
  t.deepEqual(myEndpoint2.DEFAULTS.org, "test2");
});

test("endpoint.defaults() sets mediaType.format", (t) => {
  const myEndpoint = endpoint.defaults({
    mediaType: {
      format: "raw",
    },
  });
  t.deepEqual(myEndpoint.DEFAULTS.mediaType, {
    format: "raw",
    previews: [],
  });
});

test("endpoint.defaults() merges mediaType.previews", (t) => {
  const myEndpoint = endpoint.defaults({
    mediaType: {
      previews: ["foo"],
    },
  });
  const myEndpoint2 = myEndpoint.defaults({
    mediaType: {
      previews: ["bar"],
    },
  });

  t.deepEqual(myEndpoint.DEFAULTS.mediaType, {
    format: "",
    previews: ["foo"],
  });
  t.deepEqual(myEndpoint2.DEFAULTS.mediaType, {
    format: "",
    previews: ["foo", "bar"],
  });
});

test('.defaults() merges mediaType.previews with "-preview" suffix', (t) => {
  const myEndpoint = endpoint.defaults({
    mediaType: {
      previews: ["foo-preview"],
    },
  });
  const myEndpoint2 = myEndpoint.defaults({
    mediaType: {
      previews: ["bar-preview"],
    },
  });

  t.deepEqual(myEndpoint.DEFAULTS.mediaType, {
    format: "",
    previews: ["foo"],
  });
  t.deepEqual(myEndpoint2.DEFAULTS.mediaType, {
    format: "",
    previews: ["foo", "bar"],
  });
});
