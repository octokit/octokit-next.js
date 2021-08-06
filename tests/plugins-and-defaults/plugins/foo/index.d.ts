import { Octokit } from "../../../../index.js";

export function fooPlugin(
  base: Octokit,
  options: Octokit.Options
): {
  foo: string;
};
