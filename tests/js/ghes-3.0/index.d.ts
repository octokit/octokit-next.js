import { ExtendOctokitWith, Octokit } from "@octokit-next/core";

import "@octokit-next/types-rest-api-ghes-3.0";

export const OctokitGhes30: ExtendOctokitWith<
  Octokit<"ghes-3.0">,
  {
    defaults: {
      baseUrl: string;
    };
  }
>;

// support import to be used as a class instance type
export type OctokitGhes30 = typeof OctokitGhes30;
