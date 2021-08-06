import { Octokit } from "../../../../index.js";

export function barPlugin(base: Octokit): {
  bar: string;
};
