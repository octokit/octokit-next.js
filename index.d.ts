import { Base } from "javascript-plugin-architecture-with-typescript-definitions";
import fetch from "node-fetch";

import { requestPlugin } from "./plugins/request/index.js";

// export base so it can be imported for JSDoc comments and include
// the merged Base.Options interface
export { Base } from "javascript-plugin-architecture-with-typescript-definitions";

declare module "javascript-plugin-architecture-with-typescript-definitions" {
  namespace Base {
    interface Options {
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
        fetch?: fetch;
      };
    }
  }
}

type Constructor<T> = new (...args: any[]) => T;

export namespace Octokit {
  interface ResponseHeaders {
    "cache-control"?: string;
    "content-length"?: number;
    "content-type"?: string;
    date?: string;
    etag?: string;
    "last-modified"?: string;
    link?: string;
    location?: string;
    server?: string;
    vary?: string;
    "x-github-mediatype"?: string;
    "x-github-request-id"?: string;
    "x-oauth-scopes"?: string;
    "x-ratelimit-limit"?: string;
    "x-ratelimit-remaining"?: string;
    "x-ratelimit-reset"?: string;

    [header: string]: string | number | undefined;
  }

  interface Response<T> {
    headers: Octokit.ResponseHeaders;
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
    data: T;
  }

  interface Endpoints {
    "GET /": {
      parameters: {};
      response: Octokit.Response<{
        emojis_url: string;
      }>;
    };
  }
}

export const Octokit: typeof Base &
  Constructor<ReturnType<typeof requestPlugin>>;
