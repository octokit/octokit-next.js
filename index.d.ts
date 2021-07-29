import { Base } from "javascript-plugin-architecture-with-typescript-definitions";
import fetch from "node-fetch";

import { RequestInterface } from "./plugins/request/index.js";

import "./api-versions-types/github.com";

export namespace Octokit {
  interface Options<TVersion extends keyof Octokit.ApiVersions = "github.com">
    extends Base.Options {
    /**
     * GitHub API Version. Defaults to "api.github.com"
     */
    version?: TVersion;

    /**
     * GitHub's REST API base URL. Defaults to https://api.github.com
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

  interface ApiVersions {}
}
export declare class Octokit<
  TVersion extends keyof Octokit.ApiVersions = "github.com"
> {
  constructor(options: Octokit.Options);

  request: RequestInterface<TVersion>;
}
