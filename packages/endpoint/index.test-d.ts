import { expectType } from "tsd";

import "@octokit-next/types-rest-api-ghes-3.2";

import { endpoint } from "./index.js";

export function readmeExample() {
  const requestOptions = endpoint("GET /orgs/{org}/repos", {
    headers: {
      authorization: "token 0000000000000000000000000000000000000001",
    },
    org: "octokit",
    type: "private",
  });
  expectType<"GET">(requestOptions.method);
  expectType<"/orgs/{org}/repos">(requestOptions.url);
  expectType<string>(requestOptions.headers["accept"]);
  expectType<string>(requestOptions.headers["user-agent"]);
  expectType<string | undefined>(requestOptions.headers["authorization"]);

  // @ts-expect-error - `.data` is not set for a GET operation
  requestOptions.data;
}

export function ghesExample() {
  const requestOptions = endpoint("PATCH /admin/organizations/{org}", {
    request: {
      version: "ghes-3.2",
    },
    headers: {
      authorization: "token 0000000000000000000000000000000000000001",
    },
    org: "octokit",
    login: "new-octokit",
  });

  expectType<"PATCH">(requestOptions.method);
  expectType<"/admin/organizations/{org}">(requestOptions.url);
  expectType<string>(requestOptions.headers["accept"]);
  expectType<string>(requestOptions.headers["user-agent"]);
  expectType<string | undefined>(requestOptions.headers["authorization"]);

  expectType<{
    login: string;
  }>(requestOptions.data);
}
