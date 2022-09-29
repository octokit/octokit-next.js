import { expectType } from "tsd";

import { Octokit } from "./index.js";

declare module "@octokit-next/types" {
  namespace Octokit {
    interface Endpoints {
      /**
       * Dummy endpoint for testing purposes
       */
      "GET /endpoint-test/{id}": {
        parameters: {
          id: string;
        };
        request: {
          method: "GET";
          // the resulting `.url` property will replace the `{}` placeholders, so the type must be a generic string
          url: string;
        };
        response: Octokit.Response<
          {
            test: 1;
          },
          200
        >;
      };
    }

    interface ApiVersions {
      "endpoint-test": {
        Endpoints: Octokit.Endpoints & {
          "POST /endpoint-test/{id}/version-test": {
            parameters: {
              id: string;
              test: string;
            };
            request: {
              method: "POST";
              url: string;
              data: {
                test: string;
              };
            };
            response: Octokit.Response<
              {
                test: 2;
              },
              201
            >;
          };
        };
      };
    }
  }
}

export async function readmeExample() {
  const octokit = new Octokit({ auth: `personal-access-token123` });

  const response = await octokit.request("GET /endpoint-test/{id}", {
    id: "id",
  });

  expectType<200>(response.status);
  expectType<1>(response.data.test);
  expectType<string>(response.url);
  expectType<Octokit.ResponseHeaders>(response.headers);
}

// TODO: add more type tests for `@octokit-next/core` here
