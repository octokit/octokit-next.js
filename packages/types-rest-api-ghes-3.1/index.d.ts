import { Octokit } from "@octokit-next/types";

import "@octokit-next/types-rest-api-github.com";

type GHES31ResponseHeadersDiff = {
  "x-github-enterprise-version": string;

  /** `x-dotcom-only` only exists on github.com */
  "x-dotcom-only": never;
};
type GHES31ResponseHeaders = Omit<
  Octokit.ApiVersions["github.com"]["ResponseHeaders"],
  keyof GHES31ResponseHeadersDiff
> &
  GHES31ResponseHeadersDiff;

type GHES30EndpointsDiff = {
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
      GHES31ResponseHeaders
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
      GHES31ResponseHeaders
    >;
  };

  "GET /new-ghes-only": {
    parameters: {};
    response: Octokit.Response<
      {
        ok: boolean;
      },
      GHES31ResponseHeaders
    >;
  };
};

declare module "@octokit-next/types" {
  namespace Octokit {
    interface ApiVersions {
      "ghes-3.1": {
        ResponseHeaders: GHES31ResponseHeaders;

        Endpoints: Omit<
          Octokit.ApiVersions["github.com"]["Endpoints"],
          keyof GHES30EndpointsDiff
        > &
          GHES30EndpointsDiff;
      };
    }
  }
}
