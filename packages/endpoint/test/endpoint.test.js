import { Agent } from "node:http";

import test from "ava";
import { getUserAgent } from "universal-user-agent";

import { endpoint } from "../index.js";
import { VERSION } from "../lib/version.js";

const userAgent = `octokit-next-endpoint.js/${VERSION} ${getUserAgent()}`;

test("endpoint() is a function", (t) => {
  t.assert(endpoint instanceof Function, "endpoint is a function");
});

test("endpoint() README example", (t) => {
  const options = endpoint({
    method: "GET",
    url: "/orgs/{org}/repos",
    org: "octokit",
    type: "private",
  });

  t.deepEqual(options, {
    method: "GET",
    url: "https://api.github.com/orgs/octokit/repos?type=private",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent,
    },
  });
});

test("endpoint(route, options)", (t) => {
  const options = endpoint("GET /orgs/{org}/repos", {
    org: "octokit",
    type: "private",
  });

  t.deepEqual(options, {
    method: "GET",
    url: "https://api.github.com/orgs/octokit/repos?type=private",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent,
    },
  });
});

test("endpoint(route)", (t) => {
  const options = endpoint("GET /");

  t.deepEqual(options, {
    method: "GET",
    url: "https://api.github.com/",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent,
    },
  });
});

test("endpoint() with custom user-agent header", (t) => {
  const options = endpoint("GET /", {
    headers: {
      // also test that header keys GET lowercased
      "User-Agent": "my-app/1.2.3",
    },
  });

  t.deepEqual(options, {
    method: "GET",
    url: "https://api.github.com/",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": "my-app/1.2.3",
    },
  });
});

test("endpoint(route) using full URL", (t) => {
  const options = endpoint(
    "GET https://codeload.github.com/octokit/endpoint-abcde/legacy.tar.gz/master"
  );

  t.deepEqual(options, {
    method: "GET",
    url: "https://codeload.github.com/octokit/endpoint-abcde/legacy.tar.gz/master",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent,
    },
  });
});

test("endpoint() request body", (t) => {
  const options = endpoint("POST /repos/{owner}/{repo}/issues", {
    owner: "octocat",
    repo: "hello-world",
    headers: {
      accept: "text/html;charset=utf-8",
    },
    title: "Found a bug",
    body: "I'm having a problem with this.",
    assignees: ["octocat"],
    milestone: 1,
    labels: ["bug"],
  });

  t.deepEqual(options, {
    method: "POST",
    url: "https://api.github.com/repos/octocat/hello-world/issues",
    headers: {
      accept: "text/html;charset=utf-8",
      "content-type": "application/json; charset=utf-8",
      "user-agent": userAgent,
    },
    body: {
      assignees: ["octocat"],
      body: "I'm having a problem with this.",
      labels: ["bug"],
      milestone: 1,
      title: "Found a bug",
    },
  });
});

test("endpoint() PUT without request body", (t) => {
  const options = endpoint("PUT /user/starred/{owner}/{repo}", {
    headers: {
      authorization: `token 0000000000000000000000000000000000000001`,
    },
    owner: "octocat",
    repo: "hello-world",
  });

  t.deepEqual(options, {
    method: "PUT",
    url: "https://api.github.com/user/starred/octocat/hello-world",
    headers: {
      authorization: `token 0000000000000000000000000000000000000001`,
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent,
    },
    body: "",
  });
});

test("endpoint() query parameter template", (t) => {
  const options = endpoint(
    "POST https://uploads.github.com/repos/octocat/Hello-World/releases/1/assets{?name,label}",
    {
      name: "example.zip",
      label: "short description",
      headers: {
        "content-type": "text/plain",
        "content-length": 14,
        authorization: `token 0000000000000000000000000000000000000001`,
      },
      data: "Hello, world!",
    }
  );

  t.deepEqual(options, {
    method: "POST",
    url: "https://uploads.github.com/repos/octocat/Hello-World/releases/1/assets?name=example.zip&label=short%20description",
    headers: {
      accept: "application/vnd.github.v3+json",
      authorization: `token 0000000000000000000000000000000000000001`,
      "content-type": "text/plain",
      "content-length": 14,
      "user-agent": userAgent,
    },
    body: "Hello, world!",
  });
});

test("endpoint(route, options) with query parameter as part of route", (t) => {
  const options = endpoint("GET /orgs/octokit/repos?access_token=abc4567", {
    type: "private",
  });

  t.deepEqual(options, {
    method: "GET",
    url: "https://api.github.com/orgs/octokit/repos?access_token=abc4567&type=private",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent,
    },
  });
});

test("endpoint(route, { data })", (t) => {
  const options = endpoint("POST /markdown/raw", {
    data: "Hello world github/linguist#1 **cool**, and #1!",
    headers: {
      accept: "text/html;charset=utf-8",
      "content-type": "text/plain",
    },
  });

  t.deepEqual(options, {
    method: "POST",
    url: "https://api.github.com/markdown/raw",
    headers: {
      accept: "text/html;charset=utf-8",
      "content-type": "text/plain",
      "user-agent": userAgent,
    },
    body: "Hello world github/linguist#1 **cool**, and #1!",
  });
});

test('endpoint("GET /search/issues", {q}) encoding', (t) => {
  const options = endpoint("GET /search/issues", {
    q: "location:Jyväskylä",
  });

  t.deepEqual(options, {
    method: "GET",
    url: "https://api.github.com/search/issues?q=location%3AJyv%C3%A4skyl%C3%A4",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent,
    },
  });
});

test("endpoint() request parameter", (t) => {
  const options = endpoint("GET /", {
    request: {
      timeout: 100,
    },
  });

  t.deepEqual(options, {
    method: "GET",
    url: "https://api.github.com/",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent,
    },
    request: {
      timeout: 100,
    },
  });
});

test("endpoint() request.agent", (t) => {
  const options = endpoint("GET /", {
    request: {
      agent: new Agent(),
    },
  });

  t.assert(options.request.agent instanceof Agent);
});

test("endpoint() Just URL", (t) => {
  t.deepEqual(endpoint("/").url, "https://api.github.com/");
  t.deepEqual(endpoint("/").method, "GET");
  t.deepEqual(
    endpoint("https://github.acme-inc/api/v3/").url,
    "https://github.acme-inc/api/v3/"
  );
});

test("endpoint() options.mediaType.format", (t) => {
  const options = endpoint({
    method: "GET",
    url: "/repos/{owner}/{repo}/issues/{number}",
    mediaType: {
      format: "raw",
    },
    owner: "octokit",
    repo: "endpoint.js",
    number: 123,
  });

  t.deepEqual(options, {
    method: "GET",
    url: "https://api.github.com/repos/octokit/endpoint.js/issues/123",
    headers: {
      accept: "application/vnd.github.v3.raw",
      "user-agent": userAgent,
    },
  });
});

test("endpoint() options.mediaType.previews", (t) => {
  const options = endpoint({
    method: "GET",
    url: "/repos/{owner}/{repo}/issues/{number}",
    mediaType: {
      previews: ["symmetra"],
    },
    owner: "octokit",
    repo: "endpoint.js",
    number: 123,
  });

  t.deepEqual(options, {
    method: "GET",
    url: "https://api.github.com/repos/octokit/endpoint.js/issues/123",
    headers: {
      accept: "application/vnd.github.symmetra-preview+json",
      "user-agent": userAgent,
    },
  });
});

test("endpoint() options.mediaType.previews with -preview suffix", (t) => {
  const options = endpoint({
    method: "GET",
    url: "/repos/{owner}/{repo}/issues/{number}",
    mediaType: {
      previews: ["jean-grey-preview", "symmetra-preview"],
    },
    owner: "octokit",
    repo: "endpoint.js",
    number: 123,
  });

  t.deepEqual(options, {
    method: "GET",
    url: "https://api.github.com/repos/octokit/endpoint.js/issues/123",
    headers: {
      accept:
        "application/vnd.github.jean-grey-preview+json,application/vnd.github.symmetra-preview+json",
      "user-agent": userAgent,
    },
  });
});

test("endpoint() options.mediaType.format + options.mediaType.previews", (t) => {
  const options = endpoint({
    method: "GET",
    url: "/repos/{owner}/{repo}/issues/{number}",
    mediaType: {
      format: "raw",
      previews: ["symmetra"],
    },
    owner: "octokit",
    repo: "endpoint.js",
    number: 123,
  });

  t.deepEqual(options, {
    method: "GET",
    url: "https://api.github.com/repos/octokit/endpoint.js/issues/123",
    headers: {
      accept: "application/vnd.github.symmetra-preview.raw",
      "user-agent": userAgent,
    },
  });
});

test("endpoint() options.mediaType.format + options.mediaType.previews + accept header", (t) => {
  const options = endpoint({
    method: "GET",
    url: "/repos/{owner}/{repo}/issues/{number}",
    headers: {
      accept: "application/vnd.foo-preview,application/vnd.bar-preview",
    },
    mediaType: {
      format: "raw",
      previews: ["symmetra"],
    },
    owner: "octokit",
    repo: "endpoint.js",
    number: 123,
  });

  t.deepEqual(options, {
    method: "GET",
    url: "https://api.github.com/repos/octokit/endpoint.js/issues/123",
    headers: {
      accept:
        "application/vnd.github.foo-preview.raw,application/vnd.github.bar-preview.raw,application/vnd.github.symmetra-preview.raw",
      "user-agent": userAgent,
    },
  });
});

test("endpoint() application/octet-stream accept header + previews", (t) => {
  const options = endpoint({
    method: "GET",
    url: "/repos/{owner}/{repo}/releases/assets/{asset_id}",
    headers: {
      accept: "application/octet-stream",
    },
    mediaType: {
      previews: ["symmetra"],
    },
    owner: "octokit",
    repo: "endpoint.js",
    asset_id: 123,
  });

  t.deepEqual(options, {
    method: "GET",
    url: "https://api.github.com/repos/octokit/endpoint.js/releases/assets/123",
    headers: {
      accept: "application/octet-stream",
      "user-agent": userAgent,
    },
  });
});

test("endpoint() undefined query parameter", (t) => {
  const options = endpoint({
    method: "GET",
    url: "/notifications",
    before: undefined,
  });

  t.deepEqual(options, {
    method: "GET",
    url: "https://api.github.com/notifications",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent,
    },
  });
});

test("endpoint() undefined header value", (t) => {
  const options = endpoint({
    method: "GET",
    url: "/notifications",
    headers: {
      "if-modified-since": undefined,
    },
  });

  t.not(
    "if-modified-since" in options.headers,
    "options.headers['if-modified-since'] is not set"
  );
});

test("DELETE without request body", (t) => {
  const options = endpoint("DELETE /user/following/{username}", {
    headers: {
      authorization: `token 0000000000000000000000000000000000000001`,
    },
    username: "octocat",
  });

  t.deepEqual(options, {
    method: "DELETE",
    url: "https://api.github.com/user/following/octocat",
    headers: {
      authorization: `token 0000000000000000000000000000000000000001`,
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent,
    },
  });
});

test("POST without request body", (t) => {
  const options = endpoint("POST /widgets", {
    headers: {
      authorization: `token 0000000000000000000000000000000000000001`,
    },
  });

  t.deepEqual(options, {
    method: "POST",
    url: "https://api.github.com/widgets",
    headers: {
      authorization: `token 0000000000000000000000000000000000000001`,
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent,
    },
  });
});

test("PATCH without request body", (t) => {
  const options = endpoint("PATCH /widgets/{id}", {
    headers: {
      authorization: `token 0000000000000000000000000000000000000001`,
    },
    id: "my-widget",
  });

  t.deepEqual(options, {
    body: "",
    method: "PATCH",
    url: "https://api.github.com/widgets/my-widget",
    headers: {
      authorization: `token 0000000000000000000000000000000000000001`,
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent,
    },
  });
});
