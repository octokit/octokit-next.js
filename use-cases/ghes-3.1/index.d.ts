import "../../endpoints-types/ghes-3.1-endpoints.js";

declare module "../.." {
  namespace Octokit {
    interface ResponseHeaders {
      "x-github-enterprise-version": string;
    }
  }
}

import { Octokit as OctokitCore } from "../../index.js";

export const Octokit: (new (...args: any[]) => {
  options: {
    baseUrl: string;
  };
}) &
  typeof OctokitCore;
