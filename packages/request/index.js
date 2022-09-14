const DEFAULTS = {
  baseURL: "https://api.github.com",
  request: {
    fetch: globalThis.fetch,
  },
};

/**
 * Naive implementation of [`@octokit/request`](https://github.com/octokit/request.js/) for testing purposes
 *
 * @param {import("@octokit-next/types").Octokit.Options} ConstructorOptions
 * @param {string} route
 * @param {object} [parameters] route parameters
 */
export async function request(route, parameters = {}) {
  const requestOptions = { ...DEFAULTS.request, ...parameters.request };

  const baseUrl = parameters.baseUrl || DEFAULTS.baseURL;
  const [method, pathOrUrl] = route.split(" ");
  const url = new URL(pathOrUrl, baseUrl).href;

  const response = await requestOptions.fetch(url, {
    method,
    headers: parameters.headers,
  });

  if (!response.ok) {
    const error = new Error(response.statusText);
    error.request = {
      baseUrl,
      route,
      parameters,
    };
    error.response = response;
    throw error;
  }

  return {
    status: response.status,
    url: response.url,
    headers: Object.fromEntries(response.headers),
    data: await response.json(),
  };
}
