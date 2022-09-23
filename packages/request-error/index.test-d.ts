import { expectType } from "tsd";
import { Octokit } from "@octokit-next/types";

import { RequestError } from "./index.js";

export function readmeExample() {
  const error = new RequestError("Oops", 500, {
    request: {
      method: "POST",
      url: "https://api.github.com/foo",
      body: {
        bar: "baz",
      },
      headers: {
        authorization: "token secret123",
      },
    },
    response: {
      status: 500,
      url: "https://api.github.com/foo",
      headers: {
        date: "",
        etag: "",
        server: "",
        vary: "",
        "cache-control": "",
        "content-type": "",
        "content-length": 1,
        "x-github-mediatype": "",
        "x-github-request-id": "",
        "x-ratelimit-limit": "",
        "x-ratelimit-remaining": "",
        "x-ratelimit-reset": "",
      },
      data: {
        foo: "bar",
      },
    },
  });

  expectType<string>(error.message);
  expectType<number>(error.status);
  expectType<Octokit.RequestOptions>(error.request);

  if (error.response) {
    error.response;
    expectType<Octokit.Response<unknown, number>>(error.response);
  } else {
    expectType<undefined>(error.response);
  }
}
