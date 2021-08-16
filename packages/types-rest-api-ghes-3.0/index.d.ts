import { Octokit } from "@octokit-next/types";

import {
  ResponseHeadersGHES31,
  EndpointsGHES31,
} from "@octokit-next/types-rest-api-ghes-3.1";

export type ResponseHeadersGHES30 = ResponseHeadersGHES31;

type ResponseHeaders = Omit<
  Octokit.ApiVersions["github.com"]["ResponseHeaders"],
  keyof ResponseHeadersGHES30
> &
  ResponseHeadersGHES30;

type GHES30EndpointsDiff = {
  /** new endpoint added after GHES 3.0 */
  "GET /new-endpoint": never;

  /** new endpoint added after GHES 3.0 */
  "GET /new-ghes-only": never;
};

export type EndpointsGHES30 = Omit<EndpointsGHES31, keyof GHES30EndpointsDiff> &
  GHES30EndpointsDiff;

declare module "@octokit-next/types" {
  namespace Octokit {
    interface ApiVersions {
      "ghes-3.0": {
        ResponseHeaders: ResponseHeaders;

        Endpoints: Omit<
          Octokit.ApiVersions["github.com"]["Endpoints"],
          keyof EndpointsGHES30
        > &
          EndpointsGHES30;
      };
    }
  }
}
