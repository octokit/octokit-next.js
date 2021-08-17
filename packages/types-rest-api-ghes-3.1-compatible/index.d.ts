import { Octokit } from "@octokit-next/types";

import {
  EndpointsGHES31,
  ResponseHeadersGHES31,
} from "@octokit-next/types-rest-api-ghes-3.1";

export type ResponseHeadersGHES31compatible = Omit<
  Octokit.ResponseHeaders,
  keyof ResponseHeadersGHES31
>;

export type EndpointsGHES31compatible = Omit<
  Octokit.Endpoints,
  keyof EndpointsGHES31
>;

declare module "@octokit-next/types" {
  namespace Octokit {
    interface ApiVersions {
      "ghes-3.1-compatible": {
        ResponseHeaders: ResponseHeaders;

        Endpoints: {
          [route in keyof EndpointsGHES31compatible]: {
            parameters: EndpointsGHES31compatible[route]["parameters"];
            response: Octokit.Response<
              EndpointsGHES31compatible[route]["response"]["data"],
              200,
              ResponseHeadersGHES31compatible
            >;
          };
        };
      };
    }
  }
}
