const { readdir, mkdir, rm, writeFile } = require("fs/promises");

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
  const openapiFiles = await readdir("cache/types-openapi");

  for (const sourceFilename of openapiFiles) {
    const packageName =
      sourceFilename === "api.github.com.json"
        ? "types-openapi"
        : sourceFilename.replace(/^(.*)\.json$/, "types-openapi-$1");

    if (!packageName.startsWith("types-openapi")) continue;

    await rm(`packages/${packageName}`, { recursive: true }).catch(() => {});
    console.log(`packages/${packageName} deleted`);

    await mkdir(`packages/${packageName}`);
    await writeFile(
      `packages/${packageName}/package.json`,
      prettier.format(
        JSON.stringify({
          name: `@octokit-next/${packageName}`,
          description: `Generated TypeScript definitions based on GitHub's OpenAPI spec for api.github.com`,
          repository: {
            type: "git",
            url: "https://github.com/octokit/octokit-next.js",
            directory: `packages/${packageName}`,
          },
          ...packageDefaults,
        }),
        { parser: "json" }
      )
    );
    await writeFile(
      `packages/${packageName}/README.md`,
      prettier.format(
        `
# @octokit-next/${packageName}

> Generated TypeScript definitions based on GitHub's OpenAPI spec for api.github.com

This package is continously updated based on [GitHub's OpenAPI specification](https://github.com/github/rest-api-description/) 

## Usage

\`\`\`ts
import { components } from "@octokit-next/${packageName}";

type Repository = components["schemas"]["full-repository"]
\`\`\`

## License

[MIT](LICENSE)
`,
        { parser: "markdown" }
      )
    );

    await writeFile(
      `packages/${packageName}/index.d.ts`,
      await openapiTS(`cache/types-openapi/${sourceFilename}`)
    );
    console.log(`packages/${packageName}/index.d.ts written`);
  }
}
