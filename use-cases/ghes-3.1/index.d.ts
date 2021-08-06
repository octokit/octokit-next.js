import { ExtendBaseWith, Octokit } from "../../index.js";

export const OctokitGhes31: ExtendBaseWith<
  Octokit<"ghes-3.1">,
  {
    defaults: {
      baseUrl: string;
    };
  }
>;

// support import to be used as a class instance type
export type OctokitGhes31 = typeof OctokitGhes31;
