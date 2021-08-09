import { ExtendOctokitWith, Octokit } from "@octokit-next/core";

export const OctokitCore: ExtendOctokitWith<
  Octokit<"github.com">,
  {
    defaults: {
      baseUrl: string;
    };
  }
>;

// support import to be used as a class instance type
export type OctokitCore = typeof OctokitCore;
