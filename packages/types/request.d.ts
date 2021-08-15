import { Octokit } from "./index.js";

type EndpointParameters
  <TVersion extends keyof Octokit.ApiVersions = "github.com"> = 
    { request: Octokit.RequestOptions<TVersion> } 
    & Record<string, unknown>;

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
   * Send a request to a known endpoint using a version specified in `request.version`.
   *
   * @param {string} route Request method + URL. Example: `'GET /orgs/{org}'`
   * @param {object} parameters URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  <
    RVersion extends keyof Octokit.ApiVersions,
    Route extends keyof Octokit.ApiVersions[RVersion]["Endpoints"],
    Endpoint = Octokit.ApiVersions[RVersion]["Endpoints"][Route]
  >(
    route: Route,
    options: {
      request: {
        version: RVersion;
      };
    } & ("parameters" extends keyof Endpoint
      ? Endpoint["parameters"] & EndpointParameters<RVersion>
      : never)
  ): "response" extends keyof Endpoint ? Promise<Endpoint["response"]> : never;

  /**
   * Send a request to a known endpoint
   *
   * @param {string} route Request method + URL. Example: `'GET /orgs/{org}'`
   * @param {object} [parameters] URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  <
    Route extends keyof Octokit.ApiVersions[TVersion]["Endpoints"],
    Endpoint = Octokit.ApiVersions[TVersion]["Endpoints"][Route]
  >(
    route: Route,
    options?: "parameters" extends keyof Endpoint
      ? Endpoint["parameters"] & EndpointParameters
      : never
  ): "response" extends keyof Endpoint ? Promise<Endpoint["response"]> : never;

  /**
   * Send a request to an unknown endpoint
   *
   * @param {string} route Request method + URL. Example: `'GET /orgs/{org}'`
   * @param {object} [parameters] URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  <Route extends string>(
    route: Route,
    options?: EndpointParameters
  ): Promise<UnknownResponse>;
}
