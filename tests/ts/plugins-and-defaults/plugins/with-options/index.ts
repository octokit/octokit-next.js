import { Octokit } from "@octokit-next/types";

declare module "@octokit-next/types" {
  namespace Octokit {
    interface Options {
      optional?: string;
      required: string;
    }
  }
}

export function withOptionsPlugin(octokit: Octokit, options: Octokit.Options) {
  return {
    getOptionalOption() {
      return options.optional || "my default";
    },
    getRequriedOption() {
      return options.required;
    },
  };
}
