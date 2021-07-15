import { Base } from "javascript-plugin-architecture-with-typescript-definitions";
import { Octokit } from "../../index.js";

export function requestPlugin(
  octokit: Base,
  options: Base.Options
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
    route: keyof Octokit.Endpoints | Route,
    options?: Route extends keyof Octokit.Endpoints
      ? Octokit.Endpoints[Route]["parameters"] & RequestParameters
      : RequestParameters
  ): Route extends keyof Octokit.Endpoints
    ? Promise<Octokit.Endpoints[Route]["response"]>
    : Promise<Octokit.Response<unknown>>;
}
