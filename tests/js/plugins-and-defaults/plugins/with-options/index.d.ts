import { Octokit } from "@octokit-next/types";

declare module "@octokit-next/types" {
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
  getRequriedOption: () => Octokit.Options["required"];
};
