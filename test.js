import { test } from "uvu";
import * as assert from "uvu/assert";
import fetchMock from "fetch-mock";

import { Octokit } from "./index.js";

test("octokit.request is a function", () => {
  const octokit = new Octokit();
  assert.equal(typeof octokit.request, "function");
});

test("myOctokit.request is a function", () => {
  const MyOctokit = Octokit.defaults({});
  const myOctokit = new MyOctokit();
  assert.equal(typeof myOctokit.request, "function");
});

test("octokit.request('GET /')", async () => {
  const mock = fetchMock
    .sandbox()
    .getOnce("https://api.github.com/", { ok: true });

  const octokit = new Octokit({
    request: {
      fetch: mock,
    },
  });

  const response = await octokit.request("GET /");
  assert.equal(response, {
    status: 200,
    url: "https://api.github.com/",
    headers: { "content-length": "11", "content-type": "application/json" },
    data: { ok: true },
  });
});

test("octokit.request('GET /unknown')", async () => {
  const mock = fetchMock.sandbox().getOnce("https://api.github.com/unknown", {
    status: 404,
    body: { error: "not found" },
  });

  const octokit = new Octokit({
    request: {
      fetch: mock,
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
