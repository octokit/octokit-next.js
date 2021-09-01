# `@octokit-next/types-rest-api`

> Types for github.com REST API requests and responses

🚫⚠️ This package is part of an experimental Octokit SDK for testing purpose only - DO NOT USE

[learn more](https://github.com/octokit/octokit-next.js)

## Usage

Importing the package will add all of GitHub's REST API endpoints to the `Octokit.ApiVersions["github.com"]` interface

```ts
import "@octokit-next/types-rest-api";
```

The package also exports an `Operation` generic which turns a REST API endpoint defined in a transpiled OpenAPI spec to an `Endpoint` object with `parameters`, `request`, and `response` keys.

```ts
import { paths } from "@octokit-next/types-openapi";
import { Operation } from "@octokit-next/types-rest-api";

type MyEndpoint = Operation<paths, "GET", "/">;
```

The `Operation` call signature is

```ts
Operation<paths, method, path[, requiredPreview]>
```

- `paths` is the paths object from a transpiled OpenAPI spec using [`openapi-typescript`](https://github.com/drwpow/`openapi-typescript), such as any of the `@octokit-next/types-openapi*` packages
- `method` is the HTTP method, such as `get`, `post`, `patch`, etc. (lowercase)
- `path` is the path to the endpoint, such as `/repos/:owner/:repo`
- `requiredPreview` is a string of the name of the preview if one is required in order to use that endpoint
