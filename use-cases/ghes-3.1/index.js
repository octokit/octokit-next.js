import { Octokit as OctokitCore } from "../../index.js";

export const Octokit = OctokitCore.defaults({
  version: "ghes-3.1",
});
