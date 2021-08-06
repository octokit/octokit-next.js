import fetch from "node-fetch";

import { RequestInterface } from "./plugins/request/index.js";

import "./api-versions-types/github.com";

export namespace Octokit {
  interface Options<TVersion extends keyof Octokit.ApiVersions = "github.com"> {
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
  /**
   * Pass one or multiple plugin functions to extend the `Octokit` class.
   * The instance of the new class will be extended with any keys returned by the passed plugins.
   * Pass one argument per plugin function.
   *
   * ```js
   * export function helloWorld() {
   *   return {
   *     helloWorld () {
   *       console.log('Hello world!');
   *     }
   *   };
   * }
   *
   * const MyBase = Base.withPlugins([helloWorld]);
   * const base = new MyBase();
   * base.helloWorld(); // `base.helloWorld` is typed as function
   * ```
   */
  static withPlugins<
    Class extends ClassWithPlugins,
    Plugins extends [Plugin, ...Plugin[]]
  >(
    this: Class,
    plugins: Plugins
  ): Class & {
    plugins: [...Class["plugins"], ...Plugins];
  } & Constructor<UnionToIntersection<ReturnTypeOf<Plugins>>>;

  /**
   * Set defaults for the constructor
   *
   * ```js
   * const MyBase = Base.withDefaults({ version: '1.0.0', otherDefault: 'value' });
   * const base = new MyBase({ option: 'value' }); // `version` option is not required
   * base.options // typed as `{ version: string, otherDefault: string, option: string }`
   * ```
   * @remarks
   * Ideally, we would want to make this infinitely recursive: allowing any number of
   * .withDefaults({ ... }).withDefaults({ ... }).withDefaults({ ... }).withDefaults({ ... })...
   * However, we don't see a clean way in today's TypeScript syntax to do so.
   * We instead artificially limit accurate type inference to just three levels,
   * since real users are not likely to go past that.
   * @see https://github.com/gr2m/javascript-plugin-architecture-with-typescript-definitions/pull/57
   */
  static withDefaults<
    PredefinedOptionsOne,
    ClassOne extends Constructor<Base<Octokit.Options & PredefinedOptionsOne>> &
      ClassWithPlugins
  >(
    this: ClassOne,
    defaults: PredefinedOptionsOne
  ): ConstructorRequiringOptionsIfNeeded<ClassOne, PredefinedOptionsOne> & {
    withDefaults<ClassTwo, PredefinedOptionsTwo>(
      this: ClassTwo,
      defaults: PredefinedOptionsTwo
    ): ConstructorRequiringOptionsIfNeeded<
      ClassOne & ClassTwo,
      PredefinedOptionsOne & PredefinedOptionsTwo
    > & {
      withDefaults<ClassThree, PredefinedOptionsThree>(
        this: ClassThree,
        defaults: PredefinedOptionsThree
      ): ConstructorRequiringOptionsIfNeeded<
        ClassOne & ClassTwo & ClassThree,
        PredefinedOptionsOne & PredefinedOptionsTwo & PredefinedOptionsThree
      > &
        ClassOne &
        ClassTwo &
        ClassThree;
    } & ClassOne &
      ClassTwo;
  } & ClassOne;

  /**
   * list of plugins that will be applied to all instances
   */
  static plugins: Plugin[];

  /**
   * list of default options that will be applied to all instances
   */
  static defaults: {};

  /**
   * options passed to the constructor as constructor defaults
   */
  options: Octokit.Options<TVersion>;

  constructor(options: Octokit.Options<TVersion>);

  request: RequestInterface<TVersion>;
}

export type ExtendOctokitWith<
  OctokitClass extends AbstractOctokit,
  OctokitExtensions extends Extensions
> = OctokitClass &
  ConstructorRequiringOptionsIfNeeded<
    OctokitClass & ApplyPlugins<OctokitExtensions["plugins"]>,
    OrObject<OctokitClass["options"], unknown>
  > &
  ApplyPlugins<OctokitExtensions["plugins"]> & {
    defaults: OrObject<OctokitExtensions["defaults"], undefined>;
  };

export declare type Plugin = (
  instance: Octokit,
  options: Octokit.Options
) => ApiExtension | void;

declare type ApiExtension = {
  [key: string]: unknown;
};

// helpers
declare type Constructor<T> = new (...args: any[]) => T;

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

type ClassWithPlugins = Constructor<any> & {
  plugins: Plugin[];
};

type RemainingRequirements<PredefinedOptions> =
  keyof PredefinedOptions extends never
    ? Octokit.Options
    : Omit<Octokit.Options, keyof PredefinedOptions>;

type NonOptionalKeys<Obj> = {
  [K in keyof Obj]: {} extends Pick<Obj, K> ? undefined : K;
}[keyof Obj];

type RequiredIfRemaining<PredefinedOptions, NowProvided> = NonOptionalKeys<
  RemainingRequirements<PredefinedOptions>
> extends undefined
  ? [(Partial<Octokit.Options> & NowProvided)?]
  : [
      Partial<Octokit.Options> &
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

type Extensions = {
  defaults?: {};
  plugins?: Plugin[];
};

type OrObject<T, Extender> = T extends Extender ? {} : T;

type ApplyPlugins<Plugins extends Plugin[] | undefined> =
  Plugins extends Plugin[]
    ? UnionToIntersection<ReturnType<Plugins[number]>>
    : {};

declare class AbstractOctokit {
  constructor(options: any);
  options: any;
}
