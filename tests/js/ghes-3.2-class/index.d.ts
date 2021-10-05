import { ExtendOctokitWith, Octokit } from "@octokit-next/core";

import "@octokit-next/types-rest-api-ghes-3.2";

export const OctokitGhes32: ExtendOctokitWith<
  Octokit<"ghes-3.2">,
  {
    defaults: {
      baseUrl: string;
    };
  }
>;

// support import to be used as a class instance type
export type OctokitGhes32 = typeof OctokitGhes32;
