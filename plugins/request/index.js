import nodeFetch from "node-fetch";

export function requestPlugin(octokit, options) {
  return {
    request: request.bind(null, options),
  };
}

/**
 * Naive implementation of [`@octokit/request`](https://github.com/octokit/request.js/) for testing purposes
 *
 * @param {import("../..").Base.Options} ConsructorOptions
 * @param {string} route
 * @param {object} [parameters] route parameters
 */
async function request(
  { baseUrl, request: { fetch: octokitFetch } },
  route,
  parameters = {}
) {
  const [method, pathOrUrl] = route.split(" ");
  const url = new URL(pathOrUrl, baseUrl).href;

  const fetch = octokitFetch || nodeFetch;

  const response = await fetch(url, { method, headers: parameters.headers });

  if (!response.ok) {
    const error = new Error(response.statusText);
    error.response = response;
    error.request = {
      baseUrl,
      route,
      parameters,
    };
    throw Error;
  }

  return {
    status: response.status,
    url: response.url,
    headers: Object.fromEntries(response.headers),
    data: await response.json(),
  };
}
