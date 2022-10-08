import test from "ava";
import fetchMock from "fetch-mock";

import { Octokit } from "../index.js";

// overide default user agent for testing
Octokit.DEFAULTS.userAgent = "<TESTING>";
const userAgent = `<TESTING>`;

const testAuth = Object.assign(
  async (strategyOptions, authOptions) => {
    return { type: "test", strategyOptions, authOptions };
  },
  {
    async hook(request, route, parameters) {
      return request(route, parameters);
    },
  }
);
const createTestAuth = (strategyOptions) =>
  Object.assign(testAuth.bind(null, strategyOptions), {
    hook: testAuth.hook,
  });

test("Octokit.withDefaults is a function", (t) => {
  t.assert(Octokit.withDefaults instanceof Function);
});

test("Octokit.withDefaults({ baseUr l})", async (t) => {
  const mock = fetchMock.sandbox().getOnce(
    "https://github.acme-inc.test/api/v3/",
    { ok: true },
    {
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
    }
  );

  const OctokitWithDefaults = Octokit.withDefaults({
    baseUrl: "https://github.acme-inc.test/api/v3",
    request: {
      fetch: mock,
    },
  });

  const octokit = new OctokitWithDefaults();

  await octokit.request("GET /");

  t.is(mock.done(), true);
});

test("Octokit.withDefaults({ userAgent })", async (t) => {
  const mock = fetchMock.sandbox().getOnce(
    "https://api.github.com/",
    { ok: true },
    {
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": `my-app/1.2.3 ${userAgent}`,
      },
    }
  );

  const OctokitWithDefaults = Octokit.withDefaults({
    userAgent: "my-app/1.2.3",
    request: {
      fetch: mock,
    },
  });

  const octokit = new OctokitWithDefaults();

  await octokit.request("GET /");

  t.assert(mock.done());
});

test("Octokit.withDefaults({ userAgent }) with userAgent Constructor Option", async (t) => {
  const mock = fetchMock.sandbox().getOnce(
    "https://api.github.com/",
    { ok: true },
    {
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": `my-app/1.2.3 my-octokit.js/1.2.3 ${userAgent}`,
      },
    }
  );

  const OctokitWithDefaults = Octokit.withDefaults({
    userAgent: "my-octokit.js/1.2.3",
    request: {
      fetch: mock,
    },
  });

  const octokit = new OctokitWithDefaults({
    userAgent: "my-app/1.2.3",
  });

  await octokit.request("GET /");

  t.assert(mock.done());
});

test("Octokit.withDefaults({ timeZone })", async (t) => {
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

  const OctokitWithDefaults = Octokit.withDefaults({
    timeZone: "Europe/Amsterdam",
    request: {
      fetch: mock,
    },
  });

  const octokit = new OctokitWithDefaults();

  await octokit.request("GET /");
  t.assert(mock.done());
});

test("Octokit.withDefaults({ authStrategy })", async (t) => {
  const OctokitWithDefaults = Octokit.withDefaults({
    authStrategy: createTestAuth,
  });

  const octokit = new OctokitWithDefaults();
  const authentication = await octokit.auth();

  t.is(authentication.type, "test");
});

test("Octokit.withDefaults().withDefaults()", async (t) => {
  const mock = fetchMock.sandbox().getOnce(
    "https://github.acme-inc.test/api/v3/",
    { ok: true },
    {
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": `my-app/1.2.3 ${userAgent}`,
      },
    }
  );

  const OctokitWithDefaults = Octokit.withDefaults({
    baseUrl: "https://github.acme-inc.test/api/v3",
    request: {
      fetch: mock,
    },
  }).withDefaults({
    userAgent: "my-app/1.2.3",
  });

  const octokit = new OctokitWithDefaults();

  await octokit.request("GET /");

  t.assert(mock.done());
});

test("Octokit.withPlugins().withDefaults()", (t) => {
  const mock = fetchMock.sandbox().getOnce(
    "https://github.acme-inc.test/api/v3/",
    { ok: true },
    {
      headers: {
        accept: "application/vnd.github.v3+json",
        "user-agent": userAgent,
      },
    }
  );

  const OctokitWithPluginAndDefaults = Octokit.withPlugins([
    () => {
      return {
        foo: "bar",
      };
    },
  ]).withDefaults({
    baseUrl: "https://github.acme-inc.test/api/v3",
    request: {
      fetch: mock,
    },
  });

  const octokit = new OctokitWithPluginAndDefaults();

  t.is(octokit.foo, "bar");

  return octokit.request("GET /");
});

test("Octokit.withDefaults(function)", (t) => {
  const MyOctokit = Octokit.withDefaults((options, currentDefaults) => {
    if (!options.foo) {
      options.foo = {};
    }

    t.snapshot(currentDefaults, "currentDefaults in .withDefaults() callback");

    options.foo.bar = 1;

    return options;
  });

  const myOctokit = new MyOctokit({
    foo: {
      baz: 1,
    },
  });

  t.snapshot(myOctokit.options, "myOctokit.options");
});

test("Octokit.withDefaults(opts).withDefaults(function)", (t) => {
  const plugin = (octokit, options) => {
    t.snapshot(options, "plugin options");
  };

  const MyOctokit = Octokit.withPlugins([plugin])
    .withDefaults({
      other: "foo",
    })
    .withDefaults((options, currentDefaults) => {
      if (!options.foo) {
        options.foo = {};
      }

      t.snapshot(
        currentDefaults,
        "currentDefaults in .withDefaults() callback"
      );

      options.foo.bar = 1;

      return options;
    });

  const myOctokit = new MyOctokit({
    foo: {
      baz: 1,
    },
  });

  t.snapshot(MyOctokit.DEFAULTS, "MyOctokit.DEFAULTS");
  t.snapshot(myOctokit.options, "myOctokit.options");
});

test("Octokit.withDefaults(function).withDefaults(opts)", (t) => {
  const plugin = (octokit, options) => {
    t.snapshot(options, "plugin options");
  };

  const MyOctokit = Octokit.withPlugins([plugin])
    .withDefaults((options, currentDefaults) => {
      t.snapshot(currentDefaults, "currentDefaults");
      if (!options.foo) {
        options.foo = {};
      }

      options.foo.bar = 1;

      return options;
    })
    .withDefaults({
      other: "foo",
    });

  const myOctokit = new MyOctokit({
    foo: {
      baz: 1,
    },
  });

  t.snapshot(MyOctokit.DEFAULTS, "MyOctokit.DEFAULTS");
  t.snapshot(myOctokit.options, "myOctokit.options");
});
