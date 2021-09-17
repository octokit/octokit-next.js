import { Octokit } from "./index.js";

type EndpointParameters<
  TVersion extends keyof Octokit.ApiVersions = "github.com"
> = { request?: Octokit.RequestOptions<TVersion> } & Record<string, unknown>;

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
    } & (Route extends keyof Octokit.ApiVersions[RVersion]["Endpoints"]
      ? "parameters" extends keyof Octokit.ApiVersions[RVersion]["Endpoints"][Route]
        ? Octokit.ApiVersions[RVersion]["Endpoints"][Route]["parameters"]
        : never
      : never)
  ): Route extends keyof Octokit.ApiVersions[RVersion]["Endpoints"]
    ? "response" extends keyof Octokit.ApiVersions[RVersion]["Endpoints"][Route]
      ? Octokit.ApiVersions[RVersion]["Endpoints"][Route]["response"]
      : never
    : never;

  /**
   * Send a request to a known endpoint
   *
   * @param {string} route Request method + URL. Example: `'GET /orgs/{org}'`
   * @param {object} parameters URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  <Route extends AllKnownRoutes>(
    route: Route,
    options: TVersion extends VersionsByRoute[Route]
      ? Route extends keyof Octokit.ApiVersions[TVersion]["Endpoints"]
        ? "parameters" extends keyof Octokit.ApiVersions[TVersion]["Endpoints"][Route]
          ? Octokit.ApiVersions[TVersion]["Endpoints"][Route]["parameters"]
          : never
        : never
      : {
          request: {
            version: VersionsByRoute[Route];
          };
        }
  ): Route extends keyof Octokit.ApiVersions[TVersion]["Endpoints"]
    ? "response" extends keyof Octokit.ApiVersions[TVersion]["Endpoints"][Route]
      ? Octokit.ApiVersions[TVersion]["Endpoints"][Route]["response"]
      : never
    : never;

  /**
   * Send a request to an unknown endpoint
   *
   * @param {string} route Request method + URL. Example: `'GET /orgs/{org}'`
   * @param {object} [parameters] URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  <Route extends string>(
    route: Route extends AllKnownRoutes ? never : Route,
    options?: Record<string, unknown>
  ): Promise<UnknownResponse>;
}

// turn { [version]: { Endpoints: { [route]: Endpoint } } } into { [version]: { [route]: Endpoint } }
type EndpointsByVersion = {
  [Version in keyof Octokit.ApiVersions]: "Endpoints" extends keyof Octokit.ApiVersions[Version]
    ? Octokit.ApiVersions[Version]["Endpoints"]
    : never;
};

// Generic type to remap { k1: { k2: v }} to { k2: k1[]}
type Remap<T extends EndpointsByVersion> = {
  [P in keyof T as keyof T[P]]: P;
};

type VersionsByRoute = Remap<EndpointsByVersion>;
type AllKnownRoutes = keyof VersionsByRoute;
