import { Octokit } from "@octokit-next/core";

export const OctokitGhes30 = Octokit.withDefaults({
  version: "ghes-3.0",
});
