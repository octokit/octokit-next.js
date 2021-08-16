import { Octokit } from "@octokit-next/types";

import {
  EndpointsGHES30,
  ResponseHeadersGHES30,
} from "@octokit-next/types-rest-api-ghes-3.0";

export type ResponseHeadersGHES30compatible = Omit<
  Octokit.ResponseHeaders,
  keyof ResponseHeadersGHES30
>;

export type EndpointsGHES30compatible = Omit<
  Octokit.Endpoints,
  keyof EndpointsGHES30
>;

declare module "@octokit-next/types" {
  namespace Octokit {
    interface ApiVersions {
      "ghes-3.0-compatible": {
        ResponseHeaders: ResponseHeaders;

        Endpoints: {
          [route in keyof EndpointsGHES30compatible]: {
            parameters: EndpointsGHES30compatible[route]["parameters"];
            response: Octokit.Response<
              EndpointsGHES30compatible[route]["response"]["data"],
              ResponseHeadersGHES30compatible
            >;
          };
        };
      };
    }
  }
}
