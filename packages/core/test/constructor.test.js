import test from "ava";
import fetchMock from "fetch-mock";
import { getUserAgent } from "universal-user-agent";

import { Octokit } from "../index.js";

test("new Octokit({ previews })", async (t) => {
  const mock = fetchMock.sandbox().getOnce(
    "https://api.github.com/",
    { ok: true },
    {
      headers: {
        accept:
          "application/vnd.github.jean-grey-preview+json,application/vnd.github.symmetra-preview+json",
      },
    }
  );

  const octokit = new Octokit({
    previews: [
      // test with & without -preview suffix
      "jean-grey-preview",
      "symmetra",
    ],
    request: {
      fetch: mock,
    },
  });

  await t.notThrowsAsync(() => octokit.request("/"));
});

test("new Octokit({ timeZone })", async (t) => {
  const mock = fetchMock.sandbox().getOnce(
    "https://api.github.com/",
    { ok: true },
    {
      headers: {
        accept: "application/vnd.github.v3+json",
        "time-zone": "Europe/Amsterdam",
      },
    }
  );

  const octokit = new Octokit({
    timeZone: "Europe/Amsterdam",
    request: {
      fetch: mock,
    },
  });

  await t.notThrowsAsync(() => octokit.request("GET /"));
});

test("new Octokit({ request })", async (t) => {
  const octokit = new Octokit({
    request: {
      foo: "bar",
    },
  });

  octokit.hook.wrap("request", (request, options) => {
    t.is(options.request.foo, "bar");
    return {
      data: { ok: true },
      headers: {},
      status: 200,
      url: "https://example.com",
    };
  });

  const response = await octokit.request("/");

  t.is(response.data.ok, true);
});

test("Octokit.DEFAULTS", (t) => {
  t.deepEqual(Octokit.DEFAULTS, {
    baseUrl: "https://api.github.com",
    userAgent: `octokit-next-core.js/0.0.0-development ${getUserAgent()}`,
  });
});

test("Octokit.PLUGINS", (t) => {
  t.deepEqual(Octokit.PLUGINS, []);
});
