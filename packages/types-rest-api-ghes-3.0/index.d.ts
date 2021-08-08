import { Octokit } from "../../index.js";

import "@octokit-next/types-rest-api-3.1";

type GHES30ResponseHeaders = Octokit.ApiVersions["ghes-3.1"]["ResponseHeaders"];

type GHES30EndpointsDiff = {
  /** new endpoint added after GHES 3.0 */
  "GET /new-endpoint": never;

  /** new endpoint added after GHES 3.0 */
  "GET /new-ghes-only": never;
};

declare module ".." {
  namespace Octokit {
    interface ApiVersions {
      "ghes-3.0": {
        ResponseHeaders: GHES30ResponseHeaders;

        Endpoints: Octokit.ApiVersions["ghes-3.1"]["Endpoints"] &
          GHES30EndpointsDiff;
      };
    }
  }
}
