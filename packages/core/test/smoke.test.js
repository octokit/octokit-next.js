import test from "ava";

import { Octokit } from "../index.js";

test("Octokit is a function", (t) => {
  t.assert(Octokit instanceof Function);
});
test("new Octokit()", (t) => {
  t.notThrows(() => new Octokit());
});
test("Octokit.VERSION", (t) => {
  t.is(Octokit.VERSION, "0.0.0-development");
});
