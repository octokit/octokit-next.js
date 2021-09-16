import { suite } from "uvu";
import * as assert from "uvu/assert";

import { endpoint } from "../index.js";

const test = suite("endpoint.defaults()");

test("is a function", () => {
  assert.instance(
    endpoint.defaults,
    Function,
    "endpoint.defaults() is a function"
  );
});

test("README example", () => {
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

  assert.equal(options, {
    method: "GET",
    url: "https://github-enterprise.acme-inc.com/api/v3/orgs/my-project/repos?per_page=100",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": "myApp/1.2.3",
      authorization: `token 0000000000000000000000000000000000000001`,
    },
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

  const options = myProjectEndpointWithAuth(`GET /orgs/{org}/repos`);

  assert.equal(options, {
    method: "GET",
    url: "https://github-enterprise.acme-inc.com/api/v3/orgs/my-project/repos",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": "myApp/1.2.3",
      authorization: `token 0000000000000000000000000000000000000001`,
    },
  });
});

test(".DEFAULTS", () => {
  assert.equal(endpoint.DEFAULTS.baseUrl, "https://api.github.com");
  const myEndpoint = endpoint.defaults({
    baseUrl: "https://github-enterprise.acme-inc.com/api/v3",
  });
  assert.equal(
    myEndpoint.DEFAULTS.baseUrl,
    "https://github-enterprise.acme-inc.com/api/v3"
  );
});

test(".defaults() merges options but does not yet parse", () => {
  const myEndpoint = endpoint.defaults({
    url: "/orgs/{org}",
    org: "test1",
  });
  assert.equal(myEndpoint.DEFAULTS.url, "/orgs/{org}");
  assert.equal(myEndpoint.DEFAULTS.org, "test1");
  const myEndpoint2 = myEndpoint.defaults({
    url: "/orgs/{org}",
    org: "test2",
  });
  assert.equal(myEndpoint2.DEFAULTS.url, "/orgs/{org}");
  assert.equal(myEndpoint2.DEFAULTS.org, "test2");
});

test(".defaults() sets mediaType.format", () => {
  const myEndpoint = endpoint.defaults({
    mediaType: {
      format: "raw",
    },
  });
  assert.equal(myEndpoint.DEFAULTS.mediaType, {
    format: "raw",
    previews: [],
  });
});

test(".defaults() merges mediaType.previews", () => {
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

  assert.equal(myEndpoint.DEFAULTS.mediaType, {
    format: "",
    previews: ["foo"],
  });
  assert.equal(myEndpoint2.DEFAULTS.mediaType, {
    format: "",
    previews: ["foo", "bar"],
  });
});

test('.defaults() merges mediaType.previews with "-preview" suffix', () => {
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

  assert.equal(myEndpoint.DEFAULTS.mediaType, {
    format: "",
    previews: ["foo"],
  });
  assert.equal(myEndpoint2.DEFAULTS.mediaType, {
    format: "",
    previews: ["foo", "bar"],
  });
});

test.run();
