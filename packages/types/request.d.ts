import { Octokit } from "./index.js";

type UnknownResponse = {
  /**
   * http response headers
   */
  headers: Record<string, unknown>;
  /**
   * http response code
   */
  status: number;
  /**
   * URL of response after all redirects
   */
  url: string;
  /**
   * Response data as documented in the REST API reference documentation at https://docs.github.com/rest/reference
   */
  data: unknown;
};

/**
 * The `RequestInterface` is used for both the standalone `@octokit-next/request` module
 * as well as `@octokit-next/core`'s `.request()` method.
 *
 * It has 3 overrides
 *
 * 1. When passing `{ request: { version }}` as part of the parameters, the passed version
 *    is used as a base for the types of the remaining parameters and the response
 * 2. When a known route is passed, the types for the parameters and the response are
 *    derived from the version passed in `RequestInterface<version>`, which defaults to `"github.com"`
 * 3. When an unknown route is passed, any parameters can be passed, and the response is unknown.
 */
export interface RequestInterface<
  TVersion extends keyof Octokit.ApiVersions = "github.com"
> {
  /**
   * Send a request to a known endpoint for the version specified in `request.version`.
   *
   * @param {string} route Request method + URL. Example: `'GET /orgs/{org}'`
   * @param {object} parameters URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  <Route extends AllKnownRoutes, RVersion extends VersionsByRoute[Route]>(
    route: Route,
    options: {
      request: {
        version: RVersion;
      };
    } & (Route extends keyof ParametersByVersionAndRoute[RVersion]
      ? ParametersByVersionAndRoute[RVersion][Route]
      : never)
  ): Route extends keyof ResponseByVersionAndRoute[RVersion]
    ? ResponseByVersionAndRoute[RVersion][Route]
    : never;

  /**
   * Send a request to a known endpoint
   *
   * @param {string} route Request method + URL. Example: `'GET /orgs/{org}'`
   * @param {object} parameters URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  <Route extends AllKnownRoutes>(
    ...options: ArgumentsTypesForRoute<
      Route,
      // if given route is supported by current version
      TVersion extends keyof ParametersByVersionAndRoute
        ? // then set parameter types based on version and route
          Route extends keyof ParametersByVersionAndRoute[TVersion]
          ? ParametersByVersionAndRoute[TVersion][Route]
          : // otherwise set parameter types to { request: { version } } where
            // version must be set to one of the supported versions for the route.
            // Once that happened, the above override will take over and require
            // the types for the remaining options.
            {
              request: {
                version: VersionsByRoute[Route];
              };
            }
        : never
    >
  ): Route extends keyof ResponseByVersionAndRoute[TVersion]
    ? ResponseByVersionAndRoute[TVersion][Route]
    : never;

  /**
   * It looks like you haven't imported any `@octokit-next/types-rest-api*` packages yet.
   * You are missing out!
   *
   * Install `@octokit-next/types-rest-api` and import the types to give it a try.
   * Learn more at https://github.com/octokit/types-rest-api.ts
   *
   * @param {string} route Request method + URL. Example: `'GET /orgs/{org}'`
   * @param {object} [parameters] URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  <Route extends string>(
    ...options: keyof Octokit.Endpoints extends never
      ? [Route, Record<string, unknown>?]
      : []
  ): Promise<UnknownResponse>;
}

/**
 * optimized type to lookup all known routes and the versions they are supported in.
 *
 * @example
 *
 * ```ts
 * // import REST API types for github.com, GHES 3.2 and GHES 3.1
 * import "@octokit-next/types-rest-api-ghes-3.1";
 * ```
 *
 * The `Octokit.ApiVersions` interface is now looking like this (simplified)
 *
 * ```ts
 * {
 *   "github.com": { "GET /": { … } },
 *   "ghes-3.1": { "GET /": { … }, "GET /admin/tokens": { … } },
 *   "ghes-3.2": { "GET /": { … }, "GET /admin/tokens": { … } }
 * }
 * ```
 *
 * The `VersionsByRoute` as a result looks like this
 *
 * ```ts
 * {
 *   "GET /": "github.com" | "ghes-3.1" | "ghes-3.2",
 *   "GET /admin/tokens": "ghes-3.1" | "ghes-3.2"
 * }
 * ```
 */
type VersionsByRoute = Remap<EndpointsByVersion>;

// types to improve performance of type lookups

/**
 * All known routes across all defined API versions for fast lookup
 */
type AllKnownRoutes = keyof VersionsByRoute;

/**
 * turn
 *
 * ```ts
 * { [version]: { Endpoints: { [route]: Endpoint } } }
 * ```
 *
 * into
 *
 * ```ts
 * { [version]: { [route]: Endpoint } }
 * ```
 */
type EndpointsByVersion = {
  [Version in keyof Octokit.ApiVersions]: "Endpoints" extends keyof Octokit.ApiVersions[Version]
    ? Octokit.ApiVersions[Version]["Endpoints"]
    : never;
};

/**
 * turn
 *
 * ```ts
 * { [version]: { [route]: { parameters: Parameters } } }
 * ```
 *
 * into
 *
 * ```ts
 * { [version]: { [route]: Parameters } }
 * ```
 */
type ParametersByVersionAndRoute = {
  [Version in keyof EndpointsByVersion]: {
    [Route in keyof EndpointsByVersion[Version]]: "parameters" extends keyof EndpointsByVersion[Version][Route]
      ? EndpointsByVersion[Version][Route]["parameters"]
      : never;
  };
};

/**
 * turn
 *
 * ```ts
 * { [version]: { [route]: { response: Response } } }
 * ```
 *
 * into
 *
 * ```ts
 * { [version]: { [route]: Response } }
 * ```
 */
type ResponseByVersionAndRoute = {
  [Version in keyof EndpointsByVersion]: {
    [Route in keyof EndpointsByVersion[Version]]: "response" extends keyof EndpointsByVersion[Version][Route]
      ? EndpointsByVersion[Version][Route]["response"]
      : never;
  };
};

// helpers

/**
 * Generic type to remap
 *
 * ```ts
 * { k1: { k2: v }}
 * ```
 *
 * ```ts
 * { k2: k1[]}
 * ```
 */
type Remap<T extends EndpointsByVersion> = {
  [P in keyof T as keyof T[P]]: P;
};

/**
 * Generic to find out if an object type has any required keys
 */
type NonOptionalKeys<Obj> = {
  [K in keyof Obj]: {} extends Pick<Obj, K> ? undefined : K;
}[keyof Obj];

type ArgumentsTypesForRoute<
  Route extends string,
  Parameters extends Record<string, unknown>
> = NonOptionalKeys<Parameters> extends undefined
  ? [Route, Parameters?]
  : [Route, Parameters];
