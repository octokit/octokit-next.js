import { Octokit } from "../../index.js";

export const OctokitGhes30 = Octokit.withDefaults({
  version: "ghes-3.0",
});
