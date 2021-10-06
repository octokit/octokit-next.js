import { Agent } from "http";

import { suite } from "uvu";
import * as assert from "uvu/assert";
import { getUserAgent } from "universal-user-agent";

import { endpoint } from "../index.js";
import { VERSION } from "../lib/version.js";

const userAgent = `octokit-endpoint.js/${VERSION} ${getUserAgent()}`;

const test = suite("endpoint()");

test("is a function", () => {
  assert.instance(endpoint, Function, "endpoint is a function");
});

test("README example", () => {
  const options = endpoint({
    method: "GET",
    url: "/orgs/{org}/repos",
    org: "octokit",
    type: "private",
  });

  assert.equal(options, {
    method: "GET",
    url: "https://api.github.com/orgs/octokit/repos?type=private",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent,
    },
  });
});

test("Pass route string as first argument", () => {
  const options = endpoint("GET /orgs/{org}/repos", {
    org: "octokit",
    type: "private",
  });

  assert.equal(options, {
    method: "GET",
    url: "https://api.github.com/orgs/octokit/repos?type=private",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent,
    },
  });
});

test("Pass route string as first argument without options", () => {
  const options = endpoint("GET /");

  assert.equal(options, {
    method: "GET",
    url: "https://api.github.com/",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent,
    },
  });
});

test("Custom user-agent header", () => {
  const options = endpoint("GET /", {
    headers: {
      // also test that header keys GET lowercased
      "User-Agent": "my-app/1.2.3",
    },
  });

  assert.equal(options, {
    method: "GET",
    url: "https://api.github.com/",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": "my-app/1.2.3",
    },
  });
});

test("Full URL", () => {
  const options = endpoint(
    "GET https://codeload.github.com/octokit/endpoint-abcde/legacy.tar.gz/master"
  );

  assert.equal(options, {
    method: "GET",
    url: "https://codeload.github.com/octokit/endpoint-abcde/legacy.tar.gz/master",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent,
    },
  });
});

test("Should properly handle either placeholder format on url", () => {
  const { url: url1 } = endpoint("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: "owner",
    repo: "repo",
    path: "path/to/file.txt",
  });
  const { url: url2 } = endpoint("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: "owner",
    repo: "repo",
    path: "path/to/file.txt",
  });
  assert.equal(url1, url2);
});

test("Request body", () => {
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

  assert.equal(options, {
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

test("Put without request body", () => {
  const options = endpoint("PUT /user/starred/{owner}/{repo}", {
    headers: {
      authorization: `token 0000000000000000000000000000000000000001`,
    },
    owner: "octocat",
    repo: "hello-world",
  });

  assert.equal(options, {
    method: "PUT",
    url: "https://api.github.com/user/starred/octocat/hello-world",
    headers: {
      authorization: `token 0000000000000000000000000000000000000001`,
      accept: "application/vnd.github.v3+json",
      "content-length": 0,
      "user-agent": userAgent,
    },
    body: "",
  });
});

test("Query parameter template", () => {
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

  assert.equal(options, {
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

test("URL with query parameter and additional options", () => {
  const options = endpoint("GET /orgs/octokit/repos?access_token=abc4567", {
    type: "private",
  });

  assert.equal(options, {
    method: "GET",
    url: "https://api.github.com/orgs/octokit/repos?access_token=abc4567&type=private",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent,
    },
  });
});

test("Set request body directly", () => {
  const options = endpoint("POST /markdown/raw", {
    data: "Hello world github/linguist#1 **cool**, and #1!",
    headers: {
      accept: "text/html;charset=utf-8",
      "content-type": "text/plain",
    },
  });

  assert.equal(options, {
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

test("Encode q parameter", () => {
  const options = endpoint("GET /search/issues", {
    q: "location:Jyväskylä",
  });

  assert.equal(options, {
    method: "GET",
    url: "https://api.github.com/search/issues?q=location%3AJyv%C3%A4skyl%C3%A4",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent,
    },
  });
});

test("request parameter", () => {
  const options = endpoint("GET /", {
    request: {
      timeout: 100,
    },
  });

  assert.equal(options, {
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

test("request.agent", () => {
  const options = endpoint("GET /", {
    request: {
      agent: new Agent(),
    },
  });

  assert.instance(options.request.agent, Agent);
});

test("Just URL", () => {
  assert.equal(endpoint("/").url, "https://api.github.com/");
  assert.equal(endpoint("/").method, "GET");
  assert.equal(
    endpoint("https://github.acme-inc/api/v3/").url,
    "https://github.acme-inc/api/v3/"
  );
});

test("options.mediaType.format", () => {
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

  assert.equal(options, {
    method: "GET",
    url: "https://api.github.com/repos/octokit/endpoint.js/issues/123",
    headers: {
      accept: "application/vnd.github.v3.raw",
      "user-agent": userAgent,
    },
  });
});

test("options.mediaType.previews", () => {
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

  assert.equal(options, {
    method: "GET",
    url: "https://api.github.com/repos/octokit/endpoint.js/issues/123",
    headers: {
      accept: "application/vnd.github.symmetra-preview+json",
      "user-agent": userAgent,
    },
  });
});

test("options.mediaType.previews with -preview suffix", () => {
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

  assert.equal(options, {
    method: "GET",
    url: "https://api.github.com/repos/octokit/endpoint.js/issues/123",
    headers: {
      accept:
        "application/vnd.github.jean-grey-preview+json,application/vnd.github.symmetra-preview+json",
      "user-agent": userAgent,
    },
  });
});

test("options.mediaType.format + options.mediaType.previews", () => {
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

  assert.equal(options, {
    method: "GET",
    url: "https://api.github.com/repos/octokit/endpoint.js/issues/123",
    headers: {
      accept: "application/vnd.github.symmetra-preview.raw",
      "user-agent": userAgent,
    },
  });
});

test("options.mediaType.format + options.mediaType.previews + accept header", () => {
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

  assert.equal(options, {
    method: "GET",
    url: "https://api.github.com/repos/octokit/endpoint.js/issues/123",
    headers: {
      accept:
        "application/vnd.github.foo-preview.raw,application/vnd.github.bar-preview.raw,application/vnd.github.symmetra-preview.raw",
      "user-agent": userAgent,
    },
  });
});

test("application/octet-stream accept header + previews", () => {
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

  assert.equal(options, {
    method: "GET",
    url: "https://api.github.com/repos/octokit/endpoint.js/releases/assets/123",
    headers: {
      accept: "application/octet-stream",
      "user-agent": userAgent,
    },
  });
});

test("Undefined query parameter", () => {
  const options = endpoint({
    method: "GET",
    url: "/notifications",
    before: undefined,
  });

  assert.equal(options, {
    method: "GET",
    url: "https://api.github.com/notifications",
    headers: {
      accept: "application/vnd.github.v3+json",
      "user-agent": userAgent,
    },
  });
});

test("Undefined header value", () => {
  const options = endpoint({
    method: "GET",
    url: "/notifications",
    headers: {
      "if-modified-since": undefined,
    },
  });

  assert.not("if-modified-since" in options.headers);
});

test.run();
