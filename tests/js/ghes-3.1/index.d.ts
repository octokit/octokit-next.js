import { ExtendOctokitWith, Octokit } from "@octokit-next/core";

import "@octokit-next/types-rest-api-ghes-3.1";

export const OctokitGhes31: ExtendOctokitWith<
  Octokit<"ghes-3.1">,
  {
    defaults: {
      baseUrl: string;
    };
  }
>;

// support import to be used as a class instance type
export type OctokitGhes31 = typeof OctokitGhes31;
