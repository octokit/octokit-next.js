import test from "ava";
import fetchMock from "fetch-mock";

import { request } from "@octokit-next/request";
import { Octokit } from "@octokit-next/core";

test("octokit.request is a function", (t) => {
  const octokit = new Octokit();
  t.deepEqual(typeof octokit.request, "function");
});

test("myOctokit.request is a function", (t) => {
  const MyOctokit = Octokit.withDefaults({}).withPlugins([() => {}]);
  const myOctokit = new MyOctokit();
  t.deepEqual(typeof myOctokit.request, "function");
});

test("octokit.request('GET /')", async (t) => {
  const mock = fetchMock.sandbox().get("https://api.github.com", { ok: true });

  const octokit = new Octokit({
    request: {
      fetch: mock,
    },
  });
  const response = await octokit.request("GET /");
  t.deepEqual(response.status, 200);
  t.deepEqual(response.data, { ok: true });
});

test("octokit.request('GET /unknown')", async (t) => {
  const mock = fetchMock
    .sandbox()
    .get("https://api.github.com/unknown", { status: 404 });

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

    t.deepEqual(error.response.status, 404);
  }
});

test("request('GET /')", async (t) => {
  const mock = fetchMock.sandbox().get("https://api.github.com/", { ok: true });

  const response = await request("GET /", {
    request: {
      fetch: mock,
    },
  });
  t.deepEqual(response.status, 200);
  t.deepEqual(response.data, { ok: true });
});
