import { endpoint } from "@octokit-next/endpoint";
import { request } from "@octokit-next/request";
import { withCustomRequest } from "@octokit-next/graphql";
import { getUserAgent } from "universal-user-agent";
import { Collection } from "before-after-hook";

import { VERSION } from "./lib/version.js";

export class Octokit {
  static VERSION = VERSION;
  static DEFAULTS = {
    baseUrl: endpoint.DEFAULTS.baseUrl,
    userAgent: `octokit-next-core.js/${VERSION} ${getUserAgent()}`,
  };

  static withPlugins(newPlugins) {
    const currentPlugins = this.plugins;
    return class extends this {
      static plugins = currentPlugins.concat(
        newPlugins.filter((plugin) => !currentPlugins.includes(plugin))
      );
    };
  }

  static withDefaults(defaults) {
    return class extends this {
      constructor(options) {
        super({
          ...defaults,
          ...options,
        });
      }

      static defaults = { ...defaults, ...this.defaults };
    };
  }

  static plugins = [];

  constructor(options = {}) {
    this.options = { ...this.constructor.DEFAULTS, ...options };

    const hook = new Collection();

    const requestDefaults = {
      baseUrl: this.options.baseUrl,
      headers: {},
      request: {
        ...options.request,
        hook: hook.bind(null, "request"),
      },
      mediaType: {
        previews: [],
        format: "",
      },
    };

    // prepend default user agent with `options.userAgent` if set
    requestDefaults.headers["user-agent"] = [
      options.userAgent,
      this.constructor.DEFAULTS.userAgent,
    ]
      .filter(Boolean)
      .join(" ");

    if (options.baseUrl) {
      requestDefaults.baseUrl = options.baseUrl;
    }

    if (options.previews) {
      requestDefaults.mediaType.previews = options.previews;
    }

    if (options.timeZone) {
      requestDefaults.headers["time-zone"] = options.timeZone;
    }

    // Apply plugins
    this.constructor.plugins.forEach((plugin) => {
      Object.assign(this, plugin(this, options));
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
      options.log
    );
    this.hook = hook;

    // Auth
    // (1) If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
    //     is unauthenticated. The `this.auth()` method is a no-op and no request hook is registered.
    // (2) If only `options.auth` is set, use the default token authentication strategy.
    // (3) If `options.authStrategy` is set then use it and pass in `options.auth`. Always pass own request as many strategies accept a custom request instance.
    if (!options.authStrategy) {
      if (!options.auth) {
        // (1)
        this.auth = async () => ({
          type: "unauthenticated",
        });
      } else {
        // (2)
        const auth = createTokenAuth(options.auth);
        hook.wrap("request", auth.hook);
        this.auth = auth;
      }
    } else {
      // (3)
      const { authStrategy, ...otherOptions } = options;
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
          options.auth
        )
      );
      hook.wrap("request", auth.hook);
      this.auth = auth;
    }
  }
}
