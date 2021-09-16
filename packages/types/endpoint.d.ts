import { ConditionalKeys } from "type-fest";
import { Octokit } from "./index.js";

/**
 * Generic request options as they are returned by the `endpoint()` method
 */
type GenericRequestOptions = {
  method: Octokit.RequestMethod;
  url: string;
  headers: Octokit.RequestHeaders;
  data?: unknown;
  request?: Octokit.RequestOptions;
};

type EndpointParameters<
  TVersion extends keyof Octokit.ApiVersions = "github.com"
> = { request?: Octokit.RequestOptions<TVersion> } & Record<string, unknown>;

/**
 * The `EndpointInterface` is used for both the standalone `@octokit-next/endpoint` module
 * as well as `@octokit-next/core`'s `.endpoint()` method.
 *
 * It has 3 overrides
 *
 * 1. When passing `{ request: { version }}` as part of the parameters, the passed version
 *    is used as a base for the types of the remaining parameters and the response
 * 2. When a known route is passed, the types for the parameters and the response are
 *    derived from the version passed in `EndpointInterface<version>`, which defaults to `"github.com"`
 * 3. When an unknown route is passed, any parameters can be passed, and the response is unknown.
 */
export interface EndpointInterface<
  TVersion extends keyof Octokit.ApiVersions = "github.com"
> {
  /**
   * ⚠️🚫 Known endpoint, but not supported by the selected version.
   *
   * @param {string} route Request method + URL. Example: `'GET /orgs/{org}'`
   * @param {object} parameters URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   *
   * @deprecated not really deprecated, but it's the only way to give a visual hint that you cannot use `request` with this route and version
   */
  <
    RVersion extends keyof Octokit.ApiVersions,
    Route extends ConditionalKeys<
      Octokit.ApiVersions[RVersion]["Endpoints"],
      never
    >,
    Endpoint = Octokit.ApiVersions[RVersion]["Endpoints"][Route]
  >(
    route: Route,
    options: {
      request: {
        version: RVersion;
      };
    } & Record<string, unknown>
  ): never;

  /**
   * Get request options for a known endpoint using a version specified in `request.version`.
   *
   * @param {string} route Request method + URL. Example: `'GET /orgs/{org}'`
   * @param {object} parameters URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  <
    RVersion extends keyof Octokit.ApiVersions,
    Route extends ConditionalKeysOmit<
      Octokit.ApiVersions[RVersion]["Endpoints"],
      never
    >,
    Endpoint = Octokit.ApiVersions[RVersion]["Endpoints"][Route]
  >(
    route: Route,
    options: {
      request: {
        version: RVersion;
      };
    } & ("parameters" extends keyof Endpoint
      ? Endpoint["parameters"] & EndpointParameters<RVersion>
      : Record<string, unknown>)
  ): "request" extends keyof Endpoint ? Endpoint["request"] : never;

  /**
   * Send a request to an unknown endpoint
   *
   * @param {string} route Request method + URL. Example: `'GET /orgs/{org}'`
   * @param {object} [parameters] URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  <Route extends string>(
    route: Route extends keyof Octokit.ApiVersions[TVersion]["Endpoints"]
      ? never
      : Route,
    options?: Record<string, unknown>
  ): GenericRequestOptions;

  /**
   * ⚠️🚫 Known endpoint, but not supported by the selected version.
   *
   * @param {string} unsupportedRoute Request method + URL. Example: `'GET /orgs/{org}'`
   * @param {object} [parameters] URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   *
   * @deprecated not really deprecated, but it's the only way to give a visual hint that you cannot use `request` with this route and version
   */
  <
    Route extends ConditionalKeys<
      Octokit.ApiVersions[TVersion]["Endpoints"],
      never
    >
  >(
    unsupportedRoute: Route,
    options?: never
  ): never;

  /**
   * Send a request to a known endpoint
   *
   * @param {string} route Request method + URL. Example: `'GET /orgs/{org}'`
   * @param {object} [parameters] URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  <
    Route extends ConditionalKeysOmit<
      Octokit.ApiVersions[TVersion]["Endpoints"],
      never
    >,
    Endpoint = Octokit.ApiVersions[TVersion]["Endpoints"][Route]
  >(
    route: Route,
    options?: "parameters" extends keyof Endpoint
      ? Endpoint["parameters"] & EndpointParameters<TVersion>
      : Record<string, unknown>
  ): "request" extends keyof Endpoint ? Endpoint["request"] : never;
}

type ConditionalKeysOmit<Base, Condition> = NonNullable<
  // Wrap in `NonNullable` to strip away the `undefined` type from the produced union.
  {
    // Map through all the keys of the given base type.
    [Key in keyof Base]: Base[Key] extends Condition // Omit keys with types extending the given `Condition` type.
      ? // Discard this key since the condition passes.
        never
      : // Retain this key since the condition fails.
        Key;

    // Convert the produced object into a union type of the keys which passed the conditional test.
  }[keyof Base]
>;
