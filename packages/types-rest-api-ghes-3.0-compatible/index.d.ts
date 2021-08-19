import { Octokit } from "@octokit-next/types";

import {
  EndpointsDiff,
  ResponseHeadersDiff,
} from "@octokit-next/types-rest-api-ghes-3.0";

export type ResponseHeadersCompatible = Omit<
  Octokit.ResponseHeaders,
  keyof ResponseHeadersDiff
>;

export type EndpointsCompatible = Omit<Octokit.Endpoints, keyof EndpointsDiff>;

declare module "@octokit-next/types" {
  namespace Octokit {
    interface ApiVersions {
      "ghes-3.0-compatible": {
        ResponseHeaders: EndpointsCompatible;

        Endpoints: {
          [route in keyof EndpointsCompatible]: {
            parameters: EndpointsCompatible[route]["parameters"];
            response: Octokit.Response<
              EndpointsCompatible[route]["response"]["data"],
              EndpointsCompatible[route]["response"]["status"],
              ResponseHeadersCompatible
            >;
          };
        };
      };
    }
  }
}
