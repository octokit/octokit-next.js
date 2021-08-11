import { Octokit } from "./index.js";

type EndpointParameters = { request: Octokit.RequestOptions } & Record<
  string,
  unknown
>;

export interface RequestInterface<
  TVersion extends keyof Octokit.ApiVersions = "github.com"
> {
  /**
   * Sends a request based on endpoint options
   *
   * @param {string} route Request method + URL. Example: `'GET /orgs/{org}'`
   * @param {object} [parameters] URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  <Route extends string>(
    route: keyof Octokit.ApiVersions[TVersion]["Endpoints"] | Route,
    options?: Route extends keyof Octokit.ApiVersions[TVersion]["Endpoints"]
      ? "parameters" extends keyof Octokit.ApiVersions[TVersion]["Endpoints"][Route]
        ? Octokit.ApiVersions[TVersion]["Endpoints"][Route]["parameters"] &
            EndpointParameters
        : never
      : EndpointParameters
  ): Route extends keyof Octokit.ApiVersions[TVersion]["Endpoints"]
    ? "response" extends keyof Octokit.ApiVersions[TVersion]["Endpoints"][Route]
      ? Promise<Octokit.ApiVersions[TVersion]["Endpoints"][Route]["response"]>
      : never
    : Promise<
        Octokit.Response<
          unknown,
          Octokit.ApiVersions[TVersion]["ResponseHeaders"]
        >
      >;
}
