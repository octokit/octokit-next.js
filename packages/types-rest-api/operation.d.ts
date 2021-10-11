import { Octokit } from "@octokit-next/types";
import { Simplify } from "type-fest";

type SuccessStatuses = 200 | 201 | 202 | 204 | 205;
type RedirectStatuses = 301 | 302;
type EmptyResponseStatuses = 201 | 204 | 205;
type KnownJsonResponseTypes =
  | "application/json"
  | "application/octocat-stream" // GET /octocat
  | "application/scim+json"
  | "text/html"
  | "text/plain"; // GET /zen

type ReadOnlyMethods = "get" | "head";

export type Operation<
  paths extends Record<string, any>,
  Method extends keyof paths[Url],
  Url extends keyof paths,
  preview = unknown
> = {
  parameters: Simplify<
    ToOctokitParameters<paths[Url][Method]> & RequiredPreview<preview>
  >;
  request: Method extends ReadOnlyMethods
    ? {
        method: Method extends string ? Uppercase<Method> : never;
        url: string;
        headers: Octokit.RequestHeaders;
        request: Octokit.RequestOptions;
      }
    : {
        method: Method extends string ? Uppercase<Method> : never;
        url: string;
        headers: Octokit.RequestHeaders;
        request: Octokit.RequestOptions;
        data: ExtractRequestBody<paths[Url][Method]>;
      };
  response: ExtractOctokitResponse<paths[Url][Method]>;
};

// https://stackoverflow.com/a/50375286/206879
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type ExtractParameters<T> = "parameters" extends keyof T
  ? UnionToIntersection<
      {
        [K in Exclude<keyof T["parameters"], "header">]: T["parameters"][K];
      }[Exclude<keyof T["parameters"], "header">]
    >
  : {};
type ExtractRequestBody<T> = "requestBody" extends keyof T
  ? "content" extends keyof T["requestBody"]
    ? "application/json" extends keyof T["requestBody"]["content"]
      ? T["requestBody"]["content"]["application/json"]
      : {
          data: {
            [K in keyof T["requestBody"]["content"]]: T["requestBody"]["content"][K];
          }[keyof T["requestBody"]["content"]];
        }
    : "application/json" extends keyof T["requestBody"]
    ? T["requestBody"]["application/json"]
    : {
        data: {
          [K in keyof T["requestBody"]]: T["requestBody"][K];
        }[keyof T["requestBody"]];
      }
  : {};
type ToOctokitParameters<T> = ExtractParameters<T> & ExtractRequestBody<T>;

type RequiredPreview<T> = T extends string
  ? {
      mediaType: {
        previews: [T, ...string[]];
      };
    }
  : {};

type SuccessResponseDataType<Responses> = {
  [K in SuccessStatuses & keyof Responses]: GetContentKeyIfPresent<
    Responses[K]
  > extends never
    ? never
    : Simplify<Octokit.Response<GetContentKeyIfPresent<Responses[K]>, K>>;
}[SuccessStatuses & keyof Responses];
type RedirectResponseDataType<Responses> = {
  [K in RedirectStatuses & keyof Responses]: Octokit.Response<unknown, K>;
}[RedirectStatuses & keyof Responses];
type EmptyResponseDataType<Responses> = {
  [K in EmptyResponseStatuses & keyof Responses]: Octokit.Response<never, K>;
}[EmptyResponseStatuses & keyof Responses];

type GetContentKeyIfPresent<T> = "content" extends keyof T
  ? DataType<T["content"]>
  : DataType<T>;
type DataType<T> = {
  [K in KnownJsonResponseTypes & keyof T]: T[K];
}[KnownJsonResponseTypes & keyof T];
type ExtractOctokitResponse<Operation> = "responses" extends keyof Operation
  ? SuccessResponseDataType<Operation["responses"]> extends never
    ? RedirectResponseDataType<Operation["responses"]> extends never
      ? EmptyResponseDataType<Operation["responses"]>
      : RedirectResponseDataType<Operation["responses"]>
    : SuccessResponseDataType<Operation["responses"]>
  : unknown;
