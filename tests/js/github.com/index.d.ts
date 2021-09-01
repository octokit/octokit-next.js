import { ExtendOctokitWith, Octokit } from "@octokit-next/core";

import "@octokit-next/types-rest-api";

export const OctokitAllEndpoints: ExtendOctokitWith<
  Octokit<"github.com">,
  {
    defaults: {
      baseUrl: string;
    };
  }
>;

// support import to be used as a class instance type
export type OctokitAllEndpoints = typeof OctokitAllEndpoints;
