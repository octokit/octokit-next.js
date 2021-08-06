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
  constructor(options: Octokit.Options<TVersion>);

  options: Octokit.Options<TVersion>;

  request: RequestInterface<TVersion>;
}

/**
 * @author https://stackoverflow.com/users/2887218/jcalz
 * @see https://stackoverflow.com/a/50375286/10325032
 */
declare type UnionToIntersection<Union> = (
  Union extends any ? (argument: Union) => void : never
) extends (argument: infer Intersection) => void
  ? Intersection
  : never;
declare type AnyFunction = (...args: any) => any;
declare type ReturnTypeOf<T extends AnyFunction | AnyFunction[]> =
  T extends AnyFunction
    ? ReturnType<T>
    : T extends AnyFunction[]
    ? UnionToIntersection<Exclude<ReturnType<T[number]>, void>>
    : never;

type Extensions = {
  defaults?: {};
  plugins?: Plugin[];
};

type OrObject<T, Extender> = T extends Extender ? {} : T;

type ApplyPlugins<Plugins extends Plugin[] | undefined> =
  Plugins extends Plugin[]
    ? UnionToIntersection<ReturnType<Plugins[number]>>
    : {};

type RemainingRequirements<PredefinedOptions> =
  keyof PredefinedOptions extends never
    ? Base.Options
    : Omit<Base.Options, keyof PredefinedOptions>;

type NonOptionalKeys<Obj> = {
  [K in keyof Obj]: {} extends Pick<Obj, K> ? undefined : K;
}[keyof Obj];

type RequiredIfRemaining<PredefinedOptions, NowProvided> = NonOptionalKeys<
  RemainingRequirements<PredefinedOptions>
> extends undefined
  ? [(Partial<Base.Options> & NowProvided)?]
  : [
      Partial<Base.Options> &
        RemainingRequirements<PredefinedOptions> &
        NowProvided
    ];

type ConstructorRequiringOptionsIfNeeded<Class, PredefinedOptions> = {
  defaults: PredefinedOptions;
} & {
  new <NowProvided>(
    ...options: RequiredIfRemaining<PredefinedOptions, NowProvided>
  ): Class & {
    options: NowProvided & PredefinedOptions;
  };
};

declare type ApiExtension = {
  [key: string]: unknown;
};

export declare type Plugin = (
  instance: Base,
  options: Base.Options
) => ApiExtension | void;

declare class AbstractOctokit {
  constructor(options: any);

  options: any;
}

export type ExtendBaseWith<
  OctokitClass extends AbstractOctokit,
  BaseExtensions extends Extensions
> = OctokitClass &
  ConstructorRequiringOptionsIfNeeded<
    OctokitClass & ApplyPlugins<BaseExtensions["plugins"]>,
    OrObject<OctokitClass["options"], unknown>
  > &
  ApplyPlugins<BaseExtensions["plugins"]> & {
    defaults: OrObject<BaseExtensions["defaults"], undefined>;
  };
