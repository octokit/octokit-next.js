import test from "ava";
import fetchMock from "fetch-mock";

import { Octokit } from "../index.js";

// overide default user agent for testing
Octokit.DEFAULTS.userAgent = "<TESTING>";
const userAgent = `<TESTING>`;

test("octokit.request() is a function", async (t) => {
  const octokit = new Octokit();
  t.assert(
    octokit.request instanceof Function,
    "octokit.request instanceof Function"
  );
});

test("GET /", async (t) => {
  const mock = fetchMock.sandbox().getOnce(
    "https://api.github.com/",
    { ok: true },
    {
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
    }
  );

  const octokit = new Octokit({
    request: {
      fetch: mock,
    },
  });

  await octokit.request("GET /");
  t.assert(mock.done());
});

test("custom baseUrl", async (t) => {
  const mock = fetchMock
    .sandbox()
    .getOnce("https://github.acme-inc.com/api/v3/orgs/octokit", { id: 123 });

  const octokit = new Octokit({
    baseUrl: "https://github.acme-inc.com/api/v3",
    request: {
      fetch: mock,
    },
  });

  await octokit.request("GET /orgs/{org}", {
    org: "octokit",
  });
  t.assert(mock.done());
});

test("custom user agent", async (t) => {
  const mock = fetchMock.sandbox().getOnce(
    "https://api.github.com/",
    { ok: true },
    {
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": `myApp/1.2.3 ${userAgent}`,
      },
    }
  );

  const octokit = new Octokit({
    userAgent: "myApp/1.2.3",
    request: {
      fetch: mock,
    },
  });

  await octokit.request("GET /");
  t.assert(mock.done());
});

test("custom time zone", async (t) => {
  const mock = fetchMock.sandbox().getOnce(
    "https://api.github.com/",
    { ok: true },
    {
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
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

  await octokit.request("GET /");
  t.assert(mock.done());
});

test("previews", async (t) => {
  const mock = fetchMock
    .sandbox()
    .getOnce(
      "https://api.github.com/",
      {},
      {
        headers: {
          accept:
            "application/vnd.github.foo-preview+json,application/vnd.github.bar-preview+json",
          "user-agent": userAgent,
        },
      }
    )
    .getOnce(
      "https://api.github.com/",
      {},
      {
        headers: {
          accept:
            "application/vnd.github.foo-preview.raw,application/vnd.github.bar-preview.raw,application/vnd.github.baz-preview.raw",
          "user-agent": userAgent,
        },
        overwriteRoutes: false,
      }
    );

  const octokit = new Octokit({
    previews: ["foo", "bar-preview"],
    request: {
      fetch: mock,
    },
  });

  await octokit.request("/");
  await octokit.request("/", {
    mediaType: {
      previews: ["bar", "baz-preview"],
      format: "raw",
    },
  });
  t.assert(mock.done());
});

test('octokit.request.endpoint("GET /")', (t) => {
  const octokit = new Octokit();
  const requestOptions = octokit.request.endpoint("GET /");

  t.snapshot(requestOptions);
});

test("sends null values (octokit/rest.js#765)", async (t) => {
  const mock = fetchMock.sandbox().patchOnce(
    "https://api.github.com/repos/epmatsw/example-repo/issues/1",
    {},
    {
      body: {
        milestone: null,
      },
    }
  );

  const octokit = new Octokit({
    auth: "secret123",
    request: {
      fetch: mock,
    },
  });
  await octokit.request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
    owner: "epmatsw",
    repo: "example-repo",
    milestone: null,
    issue_number: 1,
  });
  t.assert(mock.done());
});
