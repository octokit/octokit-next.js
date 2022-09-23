import { suite } from "uvu";
import * as assert from "uvu/assert";

import { RequestError } from "../index.js";

const mockOptions = {
  request: {
    method: "GET",
    url: "https://api.github.com/",
    headers: {},
  },
};

const test = suite("RequestError");

test("inherits from Error", () => {
  const error = new RequestError("test", 123, mockOptions);
  assert.instance(error, Error);
});

test("sets .name to 'RequestError'", () => {
  const error = new RequestError("test", 123, mockOptions);
  assert.equal(error.name, "HttpError");
});

test("sets .message", () => {
  assert.equal(new RequestError("test", 123, mockOptions).message, "test");
  assert.equal(new RequestError("foo", 123, mockOptions).message, "foo");
});

test("sets .status", () => {
  assert.equal(new RequestError("test", 123, mockOptions).status, 123);
  assert.equal(new RequestError("test", 404, mockOptions).status, 404);
});

test("sets .request", () => {
  const options = Object.assign({}, mockOptions, {
    request: {
      method: "POST",
      url: "https://api.github.com/authorizations",
      body: {
        note: "test",
      },
      headers: {
        authorization: "token secret123",
      },
    },
  });

  assert.equal(new RequestError("test", 123, options).request, {
    method: "POST",
    url: "https://api.github.com/authorizations",
    body: {
      note: "test",
    },
    headers: {
      authorization: "token [REDACTED]",
    },
  });
});

test("redacts credentials from error.request.url", () => {
  const options = Object.assign({}, mockOptions, {
    request: {
      method: "GET",
      url: "https://api.github.com/?client_id=123&client_secret=secret123",
      headers: {},
    },
  });

  const error = new RequestError("test", 123, options);

  assert.equal(
    error.request.url,
    "https://api.github.com/?client_id=123&client_secret=[REDACTED]"
  );
});

test("redacts client_secret from error.request.url", () => {
  const options = Object.assign({}, mockOptions, {
    request: {
      method: "GET",
      url: "https://api.github.com/?client_id=123&client_secret=secret123",
      headers: {},
    },
  });

  const error = new RequestError("test", 123, options);

  assert.equal(
    error.request.url,
    "https://api.github.com/?client_id=123&client_secret=[REDACTED]"
  );
});

test("redacts access_token from error.request.url", () => {
  const options = Object.assign({}, mockOptions, {
    request: {
      method: "GET",
      url: "https://api.github.com/?access_token=secret123",
      headers: {},
    },
  });

  const error = new RequestError("test", 123, options);

  assert.equal(
    error.request.url,
    "https://api.github.com/?access_token=[REDACTED]"
  );
});

test("error.response", () => {
  const error = new RequestError("test", 123, {
    request: mockOptions.request,
    response: {
      url: mockOptions.request.url,
      status: 404,
      data: {
        error: "Not Found",
      },
      headers: {
        "x-github-request-id": "1",
      },
    },
  });

  assert.equal(error.response, {
    data: {
      error: "Not Found",
    },
    headers: {
      "x-github-request-id": "1",
    },
    status: 404,
    url: "https://api.github.com/",
  });
});

test.run();
