import test from "ava";

import { Octokit } from "../index.js";

test("octokit.log has .debug(), .info(), .warn(), and .error() functions", (t) => {
  const octokit = new Octokit();
  t.assert(
    octokit.log.debug instanceof Function,
    "octokit.log.debug instanceof Function"
  );
  t.assert(
    octokit.log.info instanceof Function,
    "octokit.log.info instanceof Function"
  );
  t.assert(
    octokit.log.warn instanceof Function,
    "octokit.log.warn instanceof Function"
  );
  t.assert(
    octokit.log.error instanceof Function,
    "octokit.log.error instanceof Function"
  );
});

test("octokit.log .debug() and .info() are no-ops by default", (t) => {
  const originalLogDebug = console.debug;
  const originalLogInfo = console.info;
  const originalLogWarn = console.warn;
  const originalLogError = console.error;

  const calls = [];
  console.debug = () => calls.push("debug");
  console.info = () => calls.push("info");
  console.warn = () => calls.push("warn");
  console.error = () => calls.push("error");

  const octokit = new Octokit();

  octokit.log.debug("foo");
  octokit.log.info("bar");
  octokit.log.warn("baz");
  octokit.log.error("daz");

  console.debug = originalLogDebug;
  console.info = originalLogInfo;
  console.warn = originalLogWarn;
  console.error = originalLogError;

  t.deepEqual(calls, ["warn", "error"]);
});

test("octokit.log all .log.*() methods can be overwritten", (t) => {
  const calls = [];

  const octokit = new Octokit({
    log: {
      debug: () => calls.push("debug"),
      info: () => calls.push("info"),
      warn: () => calls.push("warn"),
      error: () => calls.push("error"),
    },
  });

  octokit.log.debug("foo");
  octokit.log.info("bar");
  octokit.log.warn("baz");
  octokit.log.error("daz");

  t.deepEqual(calls, ["debug", "info", "warn", "error"]);
});
