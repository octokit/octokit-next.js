import { Octokit } from "@octokit-next/types";

import {
  RemovedRoutes,
  ResponseHeadersDiff,
} from "@octokit-next/types-rest-api-ghec";

export type ResponseHeadersCompatible = Omit<
  Octokit.ResponseHeaders,
  keyof ResponseHeadersDiff
>;

export type EndpointsCompatible = Omit<Octokit.Endpoints, RemovedRoutes>;

declare module "@octokit-next/types" {
  namespace Octokit {
    interface ApiVersions {
      "ghec-compatible": {
        ResponseHeaders: ResponseHeadersCompatible;

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
