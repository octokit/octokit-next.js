import { Octokit } from "../../../../index.js";

declare module "../../../.." {
  namespace Octokit {
    interface Options {
      optional?: string;
      required: string;
    }
  }
}

export function withOptionsPlugin(
  base: Octokit,
  options: Octokit.Options
): {
  getOptionalOption: () => Required<Octokit.Options>["optional"];
  getRequiredOption: () => Octokit.Options["required"];
};
