import { Octokit } from "@octokit-next/core";

export const OctokitGhes32 = Octokit.withDefaults({
  version: "ghes-3.2",
});
