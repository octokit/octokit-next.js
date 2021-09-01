# `scripts/types-rest-api`

Scripts to update the `types-rest-api` package.

The `types-rest-api` package is fairly straightforward. It depends on the `types-openapi` package which is a direct transpilation of github.com's OpenAPI specification. It then extends the `Octokit.Endpoints` interface with all the endpoints from the OpenAPI specification.

The `types-rest-api` package works as reference point to all the other `types-rest-api-*` packages, which only implement the differences. That's why the scripts for the `types-rest-api` is separate for the rest.
