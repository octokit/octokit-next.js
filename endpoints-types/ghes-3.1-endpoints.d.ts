import { Octokit } from "../index.js";

declare module ".." {
  namespace Octokit {
    interface Endpoints {
      "ghes-3.1": Octokit.Endpoints["github.com"] & {
        "GET /emojis": {
          parameters: {};
          response: Octokit.Response<{
            "+1": string;
            "-1": string;
            "ghes-only": string;
            /** `dotcom-only` only exists on github.com */
            "dotcom-only": never;
          }>;
        };

        /** `GET /dotcom-only` only exists on github.com */
        "GET /dotcom-only": never;

        "GET /ghes-only": {
          parameters: {};
          response: Octokit.Response<{
            ok: boolean;
          }>;
        };
      };
    }
  }
}
