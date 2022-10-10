// deno-lint-ignore-file

import {
  assertInstanceOf,
  assertEquals,
} from "https://deno.land/std@0.159.0/testing/asserts.ts";

import { Octokit } from "npm:@octokit-next/core";

Deno.test("smoke", () => {
  const octokit = new Octokit();
  assertInstanceOf(octokit.request, Function);
});

Deno.test("request", async () => {
  async function mockFetch(url: string, options: any) {
    assertEquals(url, "https://api.github.com/");
    assertEquals(options.method, "GET");
    assertEquals(options.headers.accept, "application/vnd.github.v3+json");

    return new Response('{"ok": true}', {
      headers: {
        "content-type": "application/json",
      },
    });
  }
  const octokit = new Octokit({
    request: {
      fetch: mockFetch,
    },
  });

  const response = await octokit.request("/");
  assertEquals(response.data.ok, true);
});
