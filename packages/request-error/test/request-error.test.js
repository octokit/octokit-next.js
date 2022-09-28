import test from "ava";

import { RequestError } from "../index.js";

const mockOptions = {
  request: {
    method: "GET",
    url: "https://api.github.com/",
    headers: {},
  },
};

test("inherits from Error", (t) => {
  const error = new RequestError("test", 123, mockOptions);
  t.assert(error instanceof Error);
});

test("sets .name to 'RequestError'", (t) => {
  const error = new RequestError("test", 123, mockOptions);
  t.deepEqual(error.name, "HttpError");
});

test("sets .message", (t) => {
  t.deepEqual(new RequestError("test", 123, mockOptions).message, "test");
  t.deepEqual(new RequestError("foo", 123, mockOptions).message, "foo");
});

test("sets .status", (t) => {
  t.deepEqual(new RequestError("test", 123, mockOptions).status, 123);
  t.deepEqual(new RequestError("test", 404, mockOptions).status, 404);
});

test("sets .request", (t) => {
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

  t.deepEqual(new RequestError("test", 123, options).request, {
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

test("redacts credentials from error.request.url", (t) => {
  const options = Object.assign({}, mockOptions, {
    request: {
      method: "GET",
      url: "https://api.github.com/?client_id=123&client_secret=secret123",
      headers: {},
    },
  });

  const error = new RequestError("test", 123, options);

  t.deepEqual(
    error.request.url,
    "https://api.github.com/?client_id=123&client_secret=[REDACTED]"
  );
});

test("redacts client_secret from error.request.url", (t) => {
  const options = Object.assign({}, mockOptions, {
    request: {
      method: "GET",
      url: "https://api.github.com/?client_id=123&client_secret=secret123",
      headers: {},
    },
  });

  const error = new RequestError("test", 123, options);

  t.deepEqual(
    error.request.url,
    "https://api.github.com/?client_id=123&client_secret=[REDACTED]"
  );
});

test("redacts access_token from error.request.url", (t) => {
  const options = Object.assign({}, mockOptions, {
    request: {
      method: "GET",
      url: "https://api.github.com/?access_token=secret123",
      headers: {},
    },
  });

  const error = new RequestError("test", 123, options);

  t.deepEqual(
    error.request.url,
    "https://api.github.com/?access_token=[REDACTED]"
  );
});

test("error.response", (t) => {
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

  t.deepEqual(error.response, {
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
