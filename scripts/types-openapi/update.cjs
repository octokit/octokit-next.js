const { readdir, mkdir, rm, writeFile } = require("fs/promises");
const { basename } = require("path");

const prettier = require("prettier");
const openapiTS = require("openapi-typescript").default;

if (!process.env.OCTOKIT_OPENAPI_VERSION) {
  throw new Error("OCTOKIT_OPENAPI_VERSION is not set");
}

run();

const packageDefaults = {
  publishConfig: {
    access: "public",
  },
  version: "0.0.0-development",
  types: "index.d.ts",
  author: "Gregor Martynus (https://twitter.com/gr2m)",
  license: "MIT",
  octokit: {
    "openapi-version": process.env.OCTOKIT_OPENAPI_VERSION.replace(/^v/, ""),
  },
};

async function run() {
  await rm(`packages/types-openapi`, { recursive: true });
  console.log("packages/types-openapi deleted");

  await mkdir(`packages/types-openapi`);
  await writeFile(
    `packages/types-openapi/package.json`,
    prettier.format(
      JSON.stringify({
        name: `@octokit-next/types-openapi`,
        description: `Generated TypeScript definitions based on GitHub's OpenAPI spec for api.github.com`,
        repository: {
          type: "git",
          url: "https://github.com/octokit/octokit-next.js",
          directory: `packages/types-openapi`,
        },
        ...packageDefaults,
      }),
      { parser: "json" }
    )
  );
  await writeFile(
    `packages/types-openapi/README.md`,
    prettier.format(
      `
# @octokit-next/types-openapi

> Generated TypeScript definitions based on GitHub's OpenAPI spec for api.github.com

This package is continously updated based on [GitHub's OpenAPI specification](https://github.com/github/rest-api-description/) 

## Usage

\`\`\`ts
import { components } from "@octokit-next/types-openapi";

type Repository = components["schemas"]["full-repository"]
\`\`\`

## License

[MIT](LICENSE)
`,
      { parser: "markdown" }
    )
  );

  await writeFile(
    `packages/types-openapi/index.d.ts`,
    await openapiTS(`cache/types-openapi/api.github.com.json`)
  );
  console.log(`packages/types-openapi/index.d.ts written`);
}
