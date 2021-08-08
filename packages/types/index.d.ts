import fetch from "node-fetch";

/**
 * Global Octokit interfaces that can be extended as needed.
 */
export namespace Octokit {
  interface Options<TVersion extends keyof Octokit.ApiVersions = "github.com"> {
    /**
     * GitHub API Version. Defaults to "github.com"
     */
    version?: TVersion;

    /**
     * GitHub's REST API base URL. Defaults to https://api.github.com
     *
     * TODO: make it a required option if TVersion != "github.com"
     */
    baseUrl?: string;

    /**
     * Custom User Agent String. Defaults to "octokit-next/[version]"
     *
     * @example "my-app/1.2.3"
     */
    userAgent?: string;

    request?: {
      /**
       * override the built-in fetch method, e.g. for testing
       */
      fetch?: typeof fetch;
    };
  }

  interface ResponseHeaders {
    "cache-control": string;
    "content-length": number;
    "content-type": string;
    date: string;
    etag: string;
    "last-modified"?: string;
    link?: string;
    location?: string;
    server: string;
    vary: string;
    "x-github-mediatype": string;
    "x-github-request-id": string;
    "x-oauth-scopes"?: string;
    "x-ratelimit-limit": string;
    "x-ratelimit-remaining": string;
    "x-ratelimit-reset": string;
    "x-dotcom-only": string;

    [header: string]: string | number | undefined;
  }

  interface Response<TData, TResponseHeaders> {
    headers: TResponseHeaders;
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
    data: TData;
  }

  /**
   * Extendable interface for all of GitHub's REST API endpoints.
   *
   * Do not extend this interface in order to use it with GitHub Enterprise Server or AE. Extend ApiVersions[version] instead.
   */
  interface Endpoints {
    /**
     * GitHub's root api endpoint. If this is the only endpoint you see, install and import one of the `@octokit-next/types-rest-api-*` packages.
     */
    "GET /": {
      parameters: {};
      response: Octokit.Response<
        {
          emojis_url: string;
        },
        Octokit.ResponseHeaders
      >;
    };
  }

  /**
   * The API Versions interface is meant with types for the target platform.
   * Each key must export an object with `ResponseHeaders` and `Endpoints`.
   * GitHub Enterprise Server (GHES) versions may build upon each other.
   *
   * For example, if the latest GHES version is 3.1, then it should define
   * all resopnse headers and endpoints that are only available to GHES and
   * set all endpoints and response keys that don't exist on GHES to never
   * with an explanatory comment.
   *
   * GHES 3.0 can then inherit the types from GHES 3.1 and implement the changes, etc.
   *
   * The types for the target platform-specific APIs can become quite big and will
   * most likely live in their own packages.
   */
  interface ApiVersions {
    "github.com": {
      ResponseHeaders: Octokit.ResponseHeaders;
      Endpoints: Octokit.Endpoints;
    };
  }
}
