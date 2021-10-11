import { expectType, expectNotType } from "tsd";

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
          // the resulting `.url` property will replace the `{}` placeholders, so the type must be a generic string
          url: string;
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
              url: string;
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
  expectType<string>(requestOptions.url);
  expectNotType<"/endpoint-test/{id}">(requestOptions.url);
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
  expectType<string>(requestOptions.url);
  expectType<string>(requestOptions.headers["accept"]);
  expectType<string>(requestOptions.headers["user-agent"]);
  expectType<string | undefined>(requestOptions.headers["authorization"]);

  expectType<{
    test: string;
  }>(requestOptions.data);
}

export function apiWithDefaults() {
  const myEndpoint = endpoint.withDefaults({
    baseUrl: "https://github-enterprise.acme-inc.com/api/v3",
    headers: {
      "user-agent": "myApp/1.2.3",
      authorization: `token 0000000000000000000000000000000000000001`,
    },
  });

  const options = myEndpoint(`GET /endpoint-test/{id}`, {
    id: "id",
  });

  expectType<"GET">(options.method);
  expectType<string>(options.url);

  const myEndpointWithToken2 = myEndpoint.withDefaults({
    headers: {
      authorization: `token 0000000000000000000000000000000000000002`,
    },
  });

  const options2 = myEndpointWithToken2(`GET /endpoint-test/{id}`, {
    id: "id",
  });

  expectType<"GET">(options2.method);
  expectType<string>(options2.url);
}

export function apiDEFAULTS() {
  expectType<"https://api.github.com">(endpoint.DEFAULTS.baseUrl);
  const myEndpoint = endpoint.withDefaults({
    baseUrl: "https://github-enterprise.acme-inc.com/api/v3",
  });

  myEndpoint.DEFAULTS;

  expectType<"https://github-enterprise.acme-inc.com/api/v3">(
    // @ts-expect-error - TODO: fix this
    myEndpoint.DEFAULTS.baseUrl
  );
}
