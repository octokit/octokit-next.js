import { request as coreRequest } from "@octokit-next/request";

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

  request(route, parameters = {}) {
    const requestOptions = {
      ...this.options.request,
      ...parameters.request,
    };
    return coreRequest(route, {
      ...{ baseUrl: this.options.baseUrl },
      ...parameters,
      request: requestOptions,
    });
  }
}
