import { Octokit } from "../index.js";

declare module ".." {
  namespace Octokit {
    interface Endpoints {
      "github.com": {
        "GET /": {
          parameters: {};
          response: Octokit.Response<{
            emojis_url: string;
          }>;
        };
        "GET /emojis": {
          parameters: {};
          response: Octokit.Response<{
            "+1": string;
            "-1": string;
            "dotcom-only": string;
          }>;
        };
        "GET /dotcom-only": {
          parameters: {};
          response: Octokit.Response<{
            ok: boolean;
          }>;
        };
      };
    }
  }
}
