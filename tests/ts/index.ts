import { Octokit } from "../../index";

import "@octokit-next/types-rest-api-ghes-3.1";

export const MyOctokit = Octokit.withDefaults({ userAgent: "MyOctokit" });

// support import to be used as a class instance type
export type MyOctokit = typeof MyOctokit;

const octokit = new MyOctokit({
  version: "ghes-3.1",
});
