import { Octokit } from "../../index.js";

type DotcomResponseHeaders = Octokit.ResponseHeaders & {
  "x-dotcom-only": string;
};

declare module ".." {
  namespace Octokit {
    interface ApiVersions {
      "github.com": {
        ResponseHeaders: DotcomResponseHeaders;

        Endpoints: {
          "GET /": {
            parameters: {};
            response: Octokit.Response<
              {
                emojis_url: string;
              },
              DotcomResponseHeaders
            >;
          };
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
        };
      };
    }
  }
}
