import { test } from "uvu";
import * as assert from "uvu/assert";

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

test("octokit.request() is a noop", () => {
  const octokit = new Octokit();
  assert.equal(octokit.request(), void 0);
});

test.run();
