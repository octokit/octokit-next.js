import { Octokit } from "../../index.js";

export const OctokitGhes31 = Octokit.withDefaults({
  version: "ghes-3.1",
});
