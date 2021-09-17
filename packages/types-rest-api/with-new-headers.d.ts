import { Octokit } from "@octokit-next/types";
import { Simplify } from "type-fest";

/**
 * When creating types for version-specific endpoints, we need to
 * apply the version-specific headers to them.
 */
export type WithNewHeaders<
  Endpoints extends Record<string, Endpoint | never>,
  Headers extends Record<string, unknown>
> = {
  [K in keyof Endpoints]: {
    parameters: Endpoints[K]["parameters"];
    request: Endpoints[K]["request"];
    response: Simplify<
      Omit<Endpoints[K]["response"], "headers"> & {
        headers: Headers;
      }
    >;
  };
};

type Endpoint = {
  parameters: Record<string, unknown>;
  request: {
    method: string;
    url: string;
    headers: Record<string, unknown>;
    request: Octokit.RequestOptions;
  };
  response: {
    headers: Record<string, unknown>;
    status: number;
    url: string;
    data?: unknown;
  };
};
