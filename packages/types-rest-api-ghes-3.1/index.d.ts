import { Octokit } from "@octokit-next/types";

import "@octokit-next/types-rest-api";

export type ResponseHeadersDiff = {
  "x-github-enterprise-version": string;
};

type ResponseHeaders = Omit<
  Octokit.ApiVersions["github.com"]["ResponseHeaders"],
  keyof ResponseHeadersDiff
> &
  ResponseHeadersDiff;

export type EndpointsDiff = {
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
      200,
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
      200,
      ResponseHeaders
    >;
  };

  "GET /new-ghes-only": {
    parameters: {};
    response: Octokit.Response<
      {
        ok: boolean;
      },
      200,
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
          keyof EndpointsDiff
        > &
          EndpointsDiff;
      };
    }
  }
}
