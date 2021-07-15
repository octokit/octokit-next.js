// export base so it can be imported for JSDoc comments and include
// the merged Base.Options interface
export { Base } from "javascript-plugin-architecture-with-typescript-definitions";

declare module "javascript-plugin-architecture-with-typescript-definitions" {
  namespace Base {
    interface Options {
      /**
       * GitHub Enterprise Server version
       */
      version?: "api.github.com" | "ghes-3.1" | "ghes-3.0";
    }
  }
}

declare module "../.." {
  namespace Octokit {
    interface ResponseHeaders {
      "x-github-enterprise-version"?: string;
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
