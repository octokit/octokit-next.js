import { Octokit } from "@octokit-next/core";

export const OctokitAllEndpoints = Octokit.withDefaults({
  version: "github.com",
});
