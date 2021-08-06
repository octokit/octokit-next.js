import { request as coreRequest } from "./core/request/index.js";

export class Octokit {
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
  static defaults = {
    baseUrl: "https://api.github.com",
  };

  constructor(options = {}) {
    this.options = { ...this.constructor.defaults, ...options };
    this.constructor.plugins.forEach((plugin) => {
      Object.assign(this, plugin(this, options));
    });
  }

  request(route, parameters) {
    return coreRequest(this.options, route, parameters);
  }
}
