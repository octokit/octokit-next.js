import { Octokit } from "@octokit-next/types";

export function fooPlugin(
  base: Octokit,
  options: Octokit.Options
): {
  foo: string;
};
