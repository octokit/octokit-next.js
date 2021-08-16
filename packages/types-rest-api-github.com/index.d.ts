import { Octokit } from "@octokit-next/types";

declare module "@octokit-next/types" {
  namespace Octokit {
    interface ResponseHeaders {
      "x-dotcom-only": string;
    }
    interface Endpoints {
      "GET /emojis": {
        parameters: {};
        response: Octokit.Response<
          {
            "+1": string;
            "-1": string;
            "dotcom-only": string;
          },
          Octokit.ResponseHeaders
        >;
      };
      "GET /dotcom-only": {
        parameters: {};
        response: Octokit.Response<
          {
            ok: boolean;
          },
          Octokit.ResponseHeaders
        >;
      };

      /** new endpoint added after GHES 3.0 */
      "GET /new-endpoint": {
        parameters: {};
        response: Octokit.Response<
          {
            ok: boolean;
          },
          Octokit.ResponseHeaders
        >;
      };
    }
  }
}
