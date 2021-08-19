import { Octokit } from "@octokit-next/types";

import {
  ResponseHeadersDiff as ImportResponseHeadersDiff,
  EndpointsDiff as ImportEndpointsDiff,
} from "@octokit-next/types-rest-api-ghes-3.1";

export type ResponseHeadersDiff = ImportResponseHeadersDiff;

type ResponseHeaders = Omit<
  Octokit.ApiVersions["github.com"]["ResponseHeaders"],
  keyof ResponseHeadersDiff
> &
  ResponseHeadersDiff;

export type EndpointsDiff = ImportEndpointsDiff & {
  /** new endpoint added after GHES 3.0 */
  "GET /new-endpoint": never;

  /** new endpoint added after GHES 3.0 */
  "GET /new-ghes-only": never;
};

declare module "@octokit-next/types" {
  namespace Octokit {
    interface ApiVersions {
      "ghes-3.0": {
        ResponseHeaders: ResponseHeaders;

        Endpoints: Omit<
          Octokit.ApiVersions["github.com"]["Endpoints"],
          keyof EndpointsDiff
        > &
          EndpointsDiff;
      };
    }
  }
}
