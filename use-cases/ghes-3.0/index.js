import { Octokit } from "../../index.js";

export const OctokitGhes30 = Octokit.defaults({
  version: "ghes-3.0",
});
