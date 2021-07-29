import "../../endpoints-types/ghes-3.1-endpoints.js";

import { Octokit as OctokitCore } from "../../index.js";

export const Octokit: (new (...args: any[]) => {
  options: {
    baseUrl: string;
  };
}) &
  typeof OctokitCore;
