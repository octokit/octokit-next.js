import { Octokit } from "@octokit-next/core";

export const OctokitGhes31 = Octokit.withDefaults({
  version: "ghes-3.1",
});
