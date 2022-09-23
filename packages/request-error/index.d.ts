import { Octokit } from "@octokit-next/types";

/**
 * Error with extra properties to help with debugging
 */
export declare class RequestError extends Error {
  name: "HttpError";

  /**
   * http status code
   */
  status: number;

  /**
   * Request options that lead to the error.
   */
  request: Octokit.RequestOptions;

  /**
   * Response object if a response was received
   */
  response?: Octokit.Response<unknown, number>;

  constructor(
    message: string,
    statusCode: number,
    options: {
      response: Octokit.Response<unknown, number>;
      request: Octokit.RequestOptions;
    }
  );
}
