import { Octokit } from "../../index.js";

export function requestPlugin(
  octokit: Octokit,
  options: Octokit.Options
): {
  request: RequestInterface;
};

type RequestParameters = Record<string, unknown>;

export interface RequestInterface {
  /**
   * Sends a request based on endpoint options
   *
   * @param {string} route Request method + URL. Example: `'GET /orgs/{org}'`
   * @param {object} [parameters] URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  <Route extends string>(
    route: keyof Octokit.Endpoints["github.com"] | Route,
    options?: Route extends keyof Octokit.Endpoints["github.com"]
      ? Octokit.Endpoints["github.com"][Route]["parameters"] & RequestParameters
      : RequestParameters
  ): Route extends keyof Octokit.Endpoints["github.com"]
    ? Promise<Octokit.Endpoints["github.com"][Route]["response"]>
    : Promise<Octokit.Response<unknown>>;
}
