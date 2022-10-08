import test from "ava";
import fetchMock from "fetch-mock";

import { Octokit } from "../index.js";

// overide default user agent for testing
Octokit.DEFAULTS.userAgent = "<TESTING>";
const userAgent = `<TESTING>`;

test.only("octokit.hook is a function", (t) => {
  const octokit = new Octokit();
  t.assert(
    octokit.hook instanceof Function,
    "octokit.hook instanceof Function"
  );
});
test(`octokit.hook.before is a function`, (t) => {
  const octokit = new Octokit();
  t.assert(
    octokit.hook.before instanceof Function,
    "octokit.hook.before instanceof Function"
  );
});
test(`octokit.hook.after is a function`, (t) => {
  const octokit = new Octokit();
  t.assert(
    octokit.hook.after instanceof Function,
    "octokit.hook.after instanceof Function"
  );
});
test(`octokit.hook.error is a function`, (t) => {
  const octokit = new Octokit();
  t.assert(
    octokit.hook.error instanceof Function,
    "octokit.hook.error instanceof Function"
  );
});
test(`octokit.hook.wrap is a function`, (t) => {
  const octokit = new Octokit();
  t.assert(
    octokit.hook.wrap instanceof Function,
    "octokit.hook.wrap instanceof Function"
  );
});

test("octokit.hook.before('request')", (t) => {
  const mock = fetchMock
    .sandbox()
    .getOnce(
      "https://api.github.com/foo/daz/baz?qux=quux&beforeAddition=works",
      { ok: true }
    );

  const octokit = new Octokit({
    request: {
      fetch: mock,
    },
  });

  // We don't need to test all of before-after-hook's functionality, it's well tested itself.
  // But we do want to test common use cases in case we switch to a different hook implementation in future.
  octokit.hook.before("request", (options) => {
    expect(options).toStrictEqual({
      baseUrl: "https://api.github.com",
      method: "GET",
      url: "/foo/{bar}/baz",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
        "x-foo": "bar",
      },
      mediaType: {
        previews: ["octicon"],
        format: "rad",
      },
      bar: "daz",
      qux: "quux",
      request: {
        fetch: mock,
        // @ts-ignore
        hook: options.request.hook,
      },
    });

    // test alternating options
    options.beforeAddition = "works";
  });

  return octokit.request("/foo/{bar}/baz", {
    bar: "daz",
    qux: "quux",
    headers: {
      "x-foo": "bar",
    },
    mediaType: {
      previews: ["octicon"],
      format: "rad",
    },
  });
});

test("octokit.hook.after('request')", async () => {
  const mock = fetchMock
    .sandbox()
    .getOnce("https://api.github.com/", { ok: true });

  const octokit = new Octokit({
    request: {
      fetch: mock,
    },
  });

  octokit.hook.after("request", (response, requestOptions) => {
    expect(requestOptions).toStrictEqual({
      baseUrl: "https://api.github.com",
      method: "GET",
      url: "/",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
      mediaType: {
        previews: [],
        format: "",
      },
      request: {
        fetch: mock,
        hook: requestOptions.request.hook,
      },
    });

    response.data.afterAddition = "works";
  });

  const { data } = await octokit.request("/");

  expect(data).toStrictEqual({
    ok: true,
    afterAddition: "works",
  });
});

test("octokit.hook.error('request')", async () => {
  const mock = fetchMock.sandbox().getOnce("https://api.github.com/", 500);

  const octokit = new Octokit({
    request: {
      fetch: mock,
    },
  });

  // @ts-ignore - Workaround for Node 16 (https://github.com/octokit/core.js/pull/329)
  octokit.hook.error("request", (error, requestOptions) => {
    expect(error.status).toEqual(500);
    expect(requestOptions).toStrictEqual({
      baseUrl: "https://api.github.com",
      method: "GET",
      url: "/",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
      mediaType: {
        previews: [],
        format: "",
      },
      request: {
        fetch: mock,
        hook: requestOptions.request.hook,
      },
    });

    return { data: { ok: true } };
  });

  const { data } = await octokit.request("/");

  expect(data).toStrictEqual({
    ok: true,
  });
});

test("octokit.hook.wrap('request')", async () => {
  const octokit = new Octokit();

  octokit.hook.wrap("request", (request, options) => {
    expect(request).toBeInstanceOf(Function);
    expect(options).toStrictEqual({
      baseUrl: "https://api.github.com",
      method: "GET",
      url: "/",
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
      mediaType: {
        previews: [],
        format: "",
      },
      request: {
        // @ts-ignore
        hook: options.request.hook,
      },
    });

    return { data: { ok: true }, headers: {}, status: 200, url: "" };
  });

  const { data } = await octokit.request("/");

  expect(data).toStrictEqual({
    ok: true,
  });
});

test("octokit.hook()", async () => {
  const octokit = new Octokit();

  let beforeMagicCalled = false;
  octokit.hook.before("magic", (options) => {
    beforeMagicCalled = true;
  });

  await octokit.hook("magic", (options) => {
    return {
      magic: true,
    };
  });

  expect(beforeMagicCalled).toEqual(true);
});
