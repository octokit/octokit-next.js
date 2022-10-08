import { endpoint } from "@octokit-next/endpoint";
import { request } from "@octokit-next/request";
import { createTokenAuth } from "@octokit-next/auth-token";
import { withCustomRequest } from "@octokit-next/graphql";
import { getUserAgent } from "universal-user-agent";
import Hook from "before-after-hook";

import { VERSION } from "./lib/version.js";

export class Octokit {
  static VERSION = VERSION;
  static DEFAULTS = {
    baseUrl: endpoint.DEFAULTS.baseUrl,
    userAgent: `octokit-next-core.js/${VERSION} ${getUserAgent()}`,
  };

  static withPlugins(newPlugins) {
    const currentPlugins = this.PLUGINS;
    return class extends this {
      static PLUGINS = currentPlugins.concat(
        newPlugins.filter((plugin) => !currentPlugins.includes(plugin))
      );
    };
  }

  static withDefaults(defaults) {
    const newDefaultUserAgent = [defaults?.userAgent, this.DEFAULTS.userAgent]
      .filter(Boolean)
      .join(" ");

    const newDefaults = {
      ...this.DEFAULTS,
      ...defaults,
      userAgent: newDefaultUserAgent,
      request: {
        ...this.DEFAULTS.request,
        ...defaults?.request,
      },
    };

    return class extends this {
      constructor(options) {
        if (typeof defaults === "function") {
          super(defaults(options, newDefaults));
          return;
        }

        super(options);
      }

      static DEFAULTS = newDefaults;
    };
  }

  static PLUGINS = [];

  constructor(options = {}) {
    this.options = {
      ...this.constructor.DEFAULTS,
      ...options,
      request: {
        ...this.constructor.DEFAULTS.request,
        ...options?.request,
      },
    };

    const hook = new Hook.Collection();

    const requestDefaults = {
      baseUrl: this.options.baseUrl,
      headers: {},
      request: {
        ...this.options.request,
        hook: hook.bind(null, "request"),
      },
      mediaType: {
        previews: [],
        format: "",
      },
    };

    // prepend default user agent with `options.userAgent` if set
    const userAgent = [options?.userAgent, this.constructor.DEFAULTS.userAgent]
      .filter(Boolean)
      .join(" ");

    requestDefaults.headers["user-agent"] = userAgent;

    if (this.options.previews) {
      requestDefaults.mediaType.previews = this.options.previews;
    }

    if (this.options.timeZone) {
      requestDefaults.headers["time-zone"] = this.options.timeZone;
    }

    // Apply plugins
    this.constructor.PLUGINS.forEach((plugin) => {
      Object.assign(this, plugin(this, this.options));
    });

    // API
    this.request = request.defaults(requestDefaults);
    this.graphql = withCustomRequest(this.request).defaults(requestDefaults);
    this.log = Object.assign(
      {
        debug: () => {},
        info: () => {},
        warn: console.warn.bind(console),
        error: console.error.bind(console),
      },
      this.options.log
    );
    this.hook = hook;

    // Auth
    // (1) If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
    //     is unauthenticated. The `this.auth()` method is a no-op and no request hook is registered.
    // (2) If only `options.auth` is set, use the default token authentication strategy.
    // (3) If `options.authStrategy` is set then use it and pass in `options.auth`. Always pass own request as many strategies accept a custom request instance.
    if (!this.options.authStrategy) {
      if (!this.options.auth) {
        // (1)
        this.auth = async () => ({
          type: "unauthenticated",
        });
      } else {
        // (2)
        const auth = createTokenAuth({ token: this.options.auth });
        hook.wrap("request", auth.hook);
        this.auth = auth;
      }
    } else {
      // (3)
      const { authStrategy, ...otherOptions } = this.options;
      const auth = authStrategy(
        Object.assign(
          {
            request: this.request,
            log: this.log,
            // we pass the current octokit instance as well as its constructor options
            // to allow for authentication strategies that return a new octokit instance
            // that shares the same internal state as the current one. The original
            // requirement for this was the "event-octokit" authentication strategy
            // of https://github.com/probot/octokit-auth-probot.
            octokit: this,
            octokitOptions: otherOptions,
          },
          this.options.auth
        )
      );
      hook.wrap("request", auth.hook);
      this.auth = auth;
    }
  }
}
