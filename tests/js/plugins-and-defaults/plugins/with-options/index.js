/// <reference path="./index.d.ts" />

/**
 * @param {import('@octokit-next/types').Octokit} octokit
 * @param {import('@octokit-next/types').Octokit.Options} options
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
