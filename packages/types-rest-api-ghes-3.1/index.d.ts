import { Octokit } from "@octokit-next/types";

import "@octokit-next/types-rest-api-github.com";

export type ResponseHeadersGHES31 = {
  "x-github-enterprise-version": string;

  /** `x-dotcom-only` only exists on github.com */
  "x-dotcom-only": never;
};

type ResponseHeaders = Omit<
  Octokit.ApiVersions["github.com"]["ResponseHeaders"],
  keyof ResponseHeadersGHES31
> &
  ResponseHeadersGHES31;

export type EndpointsGHES31 = {
  "GET /emojis": {
    parameters: {};
    response: Octokit.Response<
      {
        "+1": string;
        "-1": string;
        "ghes-only": string;
        /** `dotcom-only` only exists on github.com */
        "dotcom-only": never;
      },
      ResponseHeaders
    >;
  };

  /** `GET /dotcom-only` only exists on github.com */
  "GET /dotcom-only": never;

  "GET /ghes-only": {
    parameters: {};
    response: Octokit.Response<
      {
        ok: boolean;
      },
      ResponseHeaders
    >;
  };

  "GET /new-ghes-only": {
    parameters: {};
    response: Octokit.Response<
      {
        ok: boolean;
      },
      ResponseHeaders
    >;
  };
};

declare module "@octokit-next/types" {
  namespace Octokit {
    interface ApiVersions {
      "ghes-3.1": {
        ResponseHeaders: ResponseHeaders;

        Endpoints: Omit<
          Octokit.ApiVersions["github.com"]["Endpoints"],
          keyof EndpointsGHES31
        > &
          EndpointsGHES31;
      };
    }
  }
}
