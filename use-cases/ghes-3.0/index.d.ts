import { ExtendBaseWith, Octokit } from "../../index.js";

import "../../api-versions-types/ghes-3.0";

export const OctokitGhes30: ExtendBaseWith<
  Octokit<"ghes-3.0">,
  {
    defaults: {
      baseUrl: string;
    };
  }
>;

// support import to be used as a class instance type
export type OctokitGhes30 = typeof OctokitGhes30;
