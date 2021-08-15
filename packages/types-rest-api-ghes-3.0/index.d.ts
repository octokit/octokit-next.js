import { Octokit } from "@octokit-next/types";

import "@octokit-next/types-rest-api-ghes-3.1";

type GHES30ResponseHeaders = Octokit.ApiVersions["ghes-3.1"]["ResponseHeaders"];

type GHES30EndpointsDiff = {
  /** new endpoint added after GHES 3.0 */
  "GET /new-endpoint": never;

  /** new endpoint added after GHES 3.0 */
  "GET /new-ghes-only": never;
};

declare module "@octokit-next/types" {
  namespace Octokit {
    interface ApiVersions {
      "ghes-3.0": {
        ResponseHeaders: GHES30ResponseHeaders;

        Endpoints: Omit<
          Octokit.ApiVersions["ghes-3.1"]["Endpoints"],
          keyof GHES30EndpointsDiff
        > &
          GHES30EndpointsDiff;
      };
    }
  }
}
