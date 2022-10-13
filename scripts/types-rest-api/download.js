import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import graphql from "github-openapi-graphql-query";
import prettier from "prettier";

if (!process.env.OCTOKIT_OPENAPI_VERSION) {
  throw new Error(`OCTOKIT_OPENAPI_VERSION environment variable must be set`);
}

const version = process.env.OCTOKIT_OPENAPI_VERSION.replace(/^v/, "");

const QUERY = `
  query ($version: String!, $ignoreChangesBefore: String!) {
    endpoints(version: $version, ignoreChangesBefore: $ignoreChangesBefore) {
      method
      url
      documentationUrl
      parameters {
        alias
        deprecated
        in
        name
      }
      previews(required: true) {
        name
      }
      renamed {
        note
      }
    }
  }`;

main();

async function main() {
  const {
    data: { endpoints },
  } = await graphql(QUERY, {
    version,
    ignoreChangesBefore: "2022-10-10",
  });

  writeFileSync(
    resolve("cache/types-rest-api/endpoints.json"),
    prettier.format(JSON.stringify(endpoints), {
      parser: "json-stringify",
    })
  );
}
