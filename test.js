import { test } from "uvu";
import * as assert from "uvu/assert";

import { Octokit } from "./index.js";

test("octokit.request is a function", () => {
  const octokit = new Octokit();
  assert.equal(typeof octokit.request, "function");
});

test("myOctokit.request is a function", () => {
  const MyOctokit = Octokit.withDefaults({});
  const myOctokit = new MyOctokit();
  assert.equal(typeof myOctokit.request, "function");
});

test("octokit.request('GET /')", async () => {
  const fetchMock = async function (url, options) {
    assert.equal(url, "https://api.github.com/");
    assert.equal(options.method, "GET");

    return {
      status: 200,
      ok: true,
      headers: new Map(),
      url: "https://api.github.com",
      async json() {
        return { ok: true };
      },
    };
  };

  const octokit = new Octokit({
    request: {
      fetch: fetchMock,
    },
  });

  const response = await octokit.request("GET /");
  assert.equal(response, {
    status: 200,
    url: "https://api.github.com",
    headers: {},
    data: { ok: true },
  });
});

test("octokit.request('GET /unknown')", async () => {
  const fetchMock = async function (url, options) {
    assert.equal(url, "https://api.github.com/unknown");
    assert.equal(options.method, "GET");

    return {
      status: 404,
      ok: false,
      url: "https://api.github.com/unknown",
      headers: new Map(),
      async json() {
        return { error: "not found" };
      },
    };
  };

  const octokit = new Octokit({
    request: {
      fetch: fetchMock,
    },
  });

  try {
    await octokit.request("GET /unknown");
    throw new Error("GET /unknown should fail");
  } catch (error) {
    if (!error.response) throw error;

    assert.equal(error.response.status, 404);
  }
});

test.run();
