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

export function objectExample() {
  // @ts-expect-error - TODO: endpoint(options) is an alternative API to endpoint(route, parameters)
  const requestOptions = endpoint({
    method: "GET",
    url: "/endpoint-test/{id}",
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

export function apiWithDefaults() {
  const myEndpoint = endpoint.defaults({
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

  const myEndpointWithToken2 = myEndpoint.defaults({
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
  const myEndpoint = endpoint.defaults({
    baseUrl: "https://github-enterprise.acme-inc.com/api/v3",
  });

  myEndpoint.DEFAULTS;

  expectType<"https://github-enterprise.acme-inc.com/api/v3">(
    // @ts-expect-error - TODO: fix this
    myEndpoint.DEFAULTS.baseUrl
  );
}

export function apiDeepDefaults() {
  expectType<"application/vnd.github.v3+json">(
    endpoint.DEFAULTS.headers.accept
  );
  const myEndpoint = endpoint.defaults({
    headers: {
      foo: "bar",
    },
  });

  // TODO: defaults should deeply merge
  // expectType<"application/vnd.github.v3+json">(
  //   myEndpoint.DEFAULTS.headers.accept
  // );
  expectType<string>(myEndpoint.DEFAULTS.headers.foo);
}

export function apiMerge() {
  const myProjectEndpoint = endpoint.defaults({
    baseUrl: "https://github-enterprise.acme-inc.com/api/v3",
    headers: {
      "user-agent": "myApp/1.2.3",
    },
    org: "my-project",
  });

  const options = myProjectEndpoint.merge("GET /orgs/{org}/repos", {
    headers: {
      authorization: `token 0000000000000000000000000000000000000001`,
    },
    org: "my-secret-project",
    type: "private",
  });

  expectType<string>(options.baseUrl);
  expectType<"GET">(options.method);
  expectType<"/orgs/{org}/repos">(options.url);
  expectType<string>(options.headers["user-agent"]);
  expectType<string>(options.headers["authorization"]);
  expectType<string>(options.org);
  expectType<string>(options.type);
  expectType<{
    format: "";
    previews: [];
  }>(options.mediaType);
}

export function apiParse() {
  // @ts-expect-error - TODO: add types for endpoint.parse(). Compare https://github.com/octokit/types.ts/blob/7e5dd312188253e962fa209b16963f78113ba8c3/src/EndpointInterface.ts#L90-L98
  const requestOptions = endpoint.parse({
    method: "GET",
    url: "/endpoint-test/{id}",
    id: "id",
  });

  // expectType<"GET">(requestOptions.method);
  // expectType<string>(requestOptions.url);
  // expectNotType<"/endpoint-test/{id}">(requestOptions.url);
}
