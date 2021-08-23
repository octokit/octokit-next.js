import { Octokit } from "@octokit-next/types";
import { Simplify } from "type-fest";

/**
 * When creating types for version-specific types, we need to iterate over
 * all unchanged endpoints types and apply the new headers types to them.
 */
export type WithNewHeaders<Endpoints extends Record<string, Endpoint>> = {
  [K in keyof Endpoints]: {
    parameters: Endpoints[K]["parameters"];
    request: Endpoints[K]["request"];
    response: Simplify<
      Omit<Endpoints[K]["response"], "headers"> & {
        headers: Octokit.ApiVersions["ghes-3.0"]["ResponseHeaders"];
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
