import test from "ava";

// overide default user agent for testing
Octokit.DEFAULTS.userAgent = "<TESTING>";
const defaultUserAgent = `<TESTING>`;

import { Octokit } from "../index.js";

const pluginFoo = () => {
  return { foo: "bar" };
};
const pluginBaz = () => {
  return { baz: "daz" };
};
const pluginQaz = () => {
  return { qaz: "naz" };
};

test("Octokit.with-plugins() gets called in constructor", (t) => {
  const MyOctokit = Octokit.withPlugins([pluginFoo]);
  const myClient = new MyOctokit();
  t.is(myClient.foo, "bar");
});

test("Octokit.with-plugins() supports multiple plugins", (t) => {
  const MyOctokit = Octokit.withPlugins([pluginFoo, pluginBaz, pluginQaz]);
  const myClient = new MyOctokit();
  t.is(myClient.foo, "bar");
  t.is(myClient.baz, "daz");
  t.is(myClient.qaz, "naz");
});
test("Octokit.with-plugins() does not override plugins of original constructor", (t) => {
  const MyOctokit = Octokit.withPlugins([pluginFoo]);
  const myClient = new MyOctokit();
  t.is(myClient.foo, "bar");
  const octokit = new Octokit();
  t.false("foo" in octokit);
});

test("Octokit.with-plugins() receives client options", (t) => {
  const MyOctokit = Octokit.withPlugins([
    (octokit, options) => {
      const { userAgent, ...remainingOptions } = options;
      t.is(userAgent, defaultUserAgent);
      t.snapshot(remainingOptions);
    },
  ]);
  new MyOctokit({ foo: "bar" });
});

test("Octokit.with-plugins() does not load the same plugin more than once", (t) => {
  const myPlugin = (octokit) => {
    if ("customKey" in octokit) {
      throw new Error("Boom!");
    }

    return {
      customKey: true,
    };
  };
  const MyOctokit = Octokit.withPlugins([myPlugin]).withPlugins([myPlugin]);
  t.notThrows(() => new MyOctokit());
});

test("Octokit.with-plugins() supports chaining", (t) => {
  const MyOctokit = Octokit.withPlugins([pluginFoo])
    .withPlugins([pluginBaz])
    .withPlugins([pluginQaz]);

  const myClient = new MyOctokit();
  t.is(myClient.foo, "bar");
  t.is(myClient.baz, "daz");
  t.is(myClient.qaz, "naz");
});
