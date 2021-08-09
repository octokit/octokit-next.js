import { Octokit } from "@octokit-next/types";

export function barPlugin(base: Octokit): {
  bar: string;
};
