import { Octokit } from "@octokit-next/types";

type DotcomResponseHeaders = Octokit.ResponseHeaders & {
  "x-dotcom-only": string;
};

declare module "@octokit-next/types" {
  namespace Octokit {
    interface Endpoints {
      "GET /emojis": {
        parameters: {};
        response: Octokit.Response<
          {
            "+1": string;
            "-1": string;
            "dotcom-only": string;
          },
          DotcomResponseHeaders
        >;
      };
      "GET /dotcom-only": {
        parameters: {};
        response: Octokit.Response<
          {
            ok: boolean;
          },
          DotcomResponseHeaders
        >;
      };

      /** new endpoint added after GHES 3.0 */
      "GET /new-endpoint": {
        parameters: {};
        response: Octokit.Response<
          {
            ok: boolean;
          },
          DotcomResponseHeaders
        >;
      };
    }
  }
}
