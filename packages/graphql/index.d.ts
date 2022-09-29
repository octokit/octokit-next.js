import { Octokit } from "@octokit-next/types";
import {
  GraphqlInterface,
  GraphQlQueryResponseData,
} from "@octokit-next/types";
import { RequestInterface } from "@octokit-next/types";

export { GraphQlQueryResponseData } from "@octokit-next/types";

export declare const graphql: GraphqlInterface;

export declare function withCustomRequest(
  customRequest: RequestInterface
): GraphqlInterface;

export declare class GraphqlResponseError<
  TResponseData extends GraphQlQueryResponseData = GraphQlQueryResponseData
> extends Error {
  readonly request: Octokit.EndpointOptions;
  readonly headers: Octokit.ResponseHeaders;
  readonly response: ServerResponseData<TResponseData>;
  name: string;
  readonly errors: GraphQlQueryResponse<never>["errors"];
  readonly data: TResponseData;

  constructor(
    request: Octokit.EndpointOptions,
    headers: Octokit.ResponseHeaders,
    response: ServerResponseData<TResponseData>
  );
}

declare type GraphQlQueryResponse<ResponseData> = {
  data: ResponseData;
  errors?: [
    {
      type: string;
      message: string;
      path: [string];
      extensions: {
        [key: string]: unknown;
      };
      locations: [
        {
          line: number;
          column: number;
        }
      ];
    }
  ];
};

declare type ServerResponseData<T> = Required<GraphQlQueryResponse<T>>;
