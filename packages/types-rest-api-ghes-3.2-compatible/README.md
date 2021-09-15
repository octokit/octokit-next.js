# `@octokit-next/types-rest-api-ghes-3.2-compatible`

> Types for GHES 3.2 (compatible) REST API requests and responses

🚫⚠️ This package is part of an experimental Octokit SDK for testing purpose only - DO NOT USE

[learn more](https://github.com/octokit/octokit-next.js)

The goal for this package is to enable developers to build code that will work in both environments: github.com and GHES 3.2. Only endpoints and properties that exist in both have types by default.

The version can be overwritten on a per-request basis as needed.

## Usage

```ts
const octokit = new Octokit({
  version: "ghes-3.2-compatible",
});
const response = await octokit.request("GET /");
```

The routes suggested for `octokit.request(route)` are only the ones that exist for `version: "github.com"` and have no overrides for `version: "ghes-3.2"`. The same is true for `response.headers`.

To override the version specified in the constructor it can be set using the `request.version` option

```ts
const ghesOnlyResponse = await octokit.request("GET /admins/users", {
  request: {
    version: "ghes-3.2",
  },
});
```
