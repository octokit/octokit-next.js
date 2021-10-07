import { expectType } from "tsd";

import { endpoint } from "./index.js";

declare module "@octokit-next/types" {
  namespace Octokit {
    interface Endpoints {
      /**
       * @see https://docs.github.com/rest/reference/apps#delete-an-installation-for-the-authenticated-app
       */
      "GET /endpoint-test/{id}": {
        parameters: {
          id: string;
        };
        request: {
          method: "GET";
          url: "/endpoint-test/{id}";
        };
        response: {};
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
              url: "/endpoint-test/{id}/version-test";
              data: {
                test: string;
              };
            };
            response: {};
          };
        };
      };
    }
  }
}

export function readmeExample() {
  const requestOptions = endpoint("GET /endpoint-test/{id}", {
    id: "id",
  });
  expectType<"GET">(requestOptions.method);
  expectType<"/endpoint-test/{id}">(requestOptions.url);
  expectType<string>(requestOptions.headers["accept"]);
  expectType<string>(requestOptions.headers["user-agent"]);
  expectType<string | undefined>(requestOptions.headers["authorization"]);

  // @ts-expect-error - `.data` is not set for a GET operation
  requestOptions.data;
}

export function ghesExample() {
  const requestOptions = endpoint("POST /endpoint-test/{id}/version-test", {
    request: {
      version: "endpoint-test",
    },
    id: "id",
    test: "test",
  });

  expectType<"POST">(requestOptions.method);
  expectType<"/endpoint-test/{id}/version-test">(requestOptions.url);
  expectType<string>(requestOptions.headers["accept"]);
  expectType<string>(requestOptions.headers["user-agent"]);
  expectType<string | undefined>(requestOptions.headers["authorization"]);

  expectType<{
    test: string;
  }>(requestOptions.data);
}
