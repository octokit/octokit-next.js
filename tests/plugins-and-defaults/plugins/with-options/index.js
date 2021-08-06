/// <reference path="./index.d.ts" />

/**
 * @param {import('../../../..').Octokit} octokit
 * @param {import('../../../..').Octokit.Options} options
 */
export function withOptionsPlugin(octokit, options) {
  return {
    getOptionalOption() {
      return options.optional || "my default";
    },
    getRequriedOption() {
      return options.required;
    },
  };
}
