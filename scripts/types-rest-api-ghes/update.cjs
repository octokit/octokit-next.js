const { readFileSync } = require("fs");
const { readdir, mkdir, rm, writeFile } = require("fs/promises");
const { resolve } = require("path");

const Handlebars = require("handlebars");
const prettier = require("prettier");
const sortKeys = require("sort-keys");

if (!process.env.OCTOKIT_OPENAPI_VERSION) {
  throw new Error("OCTOKIT_OPENAPI_VERSION is not set");
}

const DIFF_TO_DOTCOM_TEMPLATE_PATH = resolve(
  __dirname,
  "templates/diff-to-github.com.d.ts.template"
);
const DIFF_TO_GHES_TEMPLATE_PATH = resolve(
  __dirname,
  "templates/diff-to-ghes.d.ts.template"
);

const templateDiffToDotcom = Handlebars.compile(
  readFileSync(DIFF_TO_DOTCOM_TEMPLATE_PATH, "utf8")
);
const templateDiffToGHES = Handlebars.compile(
  readFileSync(DIFF_TO_GHES_TEMPLATE_PATH, "utf8")
);

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

run();

async function run() {
  const diffFiles = await readdir("cache/types-rest-api-ghes");

  for (const diffFile of diffFiles) {
    const [currentVersion, diffVersion] = toVersions(diffFile);
    const currentVersionName = currentVersion.replace("-", " ").toUpperCase();

    const packageName = `types-rest-api-${currentVersion}`;
    const diffPackageName =
      diffVersion === "api.github.com"
        ? `types-rest-api`
        : `types-rest-api-${diffVersion}`;
    const packagePath = `packages/${packageName}`;

    // delete current package directory
    await rm(packagePath, { recursive: true });
    console.log("%s deleted", packagePath);

    // recreate package directory
    await mkdir(packagePath);

    // create package.json
    await writeFile(
      `${packagePath}/package.json`,
      prettier.format(
        JSON.stringify({
          name: `@octokit-next/${packageName}`,
          description: `Generated TypeScript definitions based on GitHub's OpenAPI spec for api.github.com`,
          repository: {
            type: "git",
            url: "https://github.com/octokit/octokit-next.js.git",
            directory: packagePath,
          },
          dependencies: {
            "@octokit-next/types": "0.0.0-development",
            [`@octokit-next/${diffPackageName}`]: "0.0.0-development",
            [`@octokit-next/types-openapi-${currentVersion}`]:
              "0.0.0-development",
          },
          ...packageDefaults,
        }),
        { parser: "json" }
      )
    );
    console.log("%s updated", `${packagePath}/package.json`);

    // create README.md
    await writeFile(
      `${packagePath}/README.md`,
      prettier.format(
        `
# \`@octokit-next/${packageName}\`

> Types for ${currentVersionName} REST API requests and responses

🚫⚠️ This package is part of an experimental Octokit SDK for testing purpose only - DO NOT USE

[learn more](https://github.com/octokit/octokit-next.js)
        
`,
        { parser: "markdown" }
      )
    );
    console.log("%s updated", `${packagePath}/README.md`);

    // create index.d.ts
    const { paths } = JSON.parse(
      readFileSync("cache/types-rest-api-ghes/" + diffFile, "utf8")
    );

    const removedEndpointsByRoute = {};

    for (const [path, methods] of paths["removed"]) {
      for (const [method, operation] of Object.entries(methods)) {
        const route = [method.toUpperCase(), path].join(" ");

        removedEndpointsByRoute[route] = {
          documentationUrl: operation.externalDocs.url,
        };
      }
    }

    const template =
      diffVersion === "github.com" ? templateDiffToDotcom : templateDiffToGHES;

    const result = template({
      currentVersion,
      diffVersion,
      removedEndpointsByRoute: sortKeys(removedEndpointsByRoute, {
        deep: true,
      }),
    });

    const declarationsPath = resolve(`${packagePath}/index.d.ts`);

    await writeFile(
      declarationsPath,
      prettier.format(result, { parser: "typescript" })
    );
    console.log(`${declarationsPath} updated.`);
  }

  // for (const endpoint of ENDPOINTS) {
  //   if (endpoint.renamed) continue;

  //   const route = `${endpoint.method} ${endpoint.url}`;

  //   // The root endpoint types are set by default
  //   if (route === "GET /") continue;

  //   endpointsByRoute[route] = {
  //     method: endpoint.method.toLowerCase(),
  //     url: toOpenApiUrl(endpoint),
  //     requiredPreview: (endpoint.previews[0] || {}).name,
  //     documentationUrl: endpoint.documentationUrl,
  //   };

  //   // handle deprecated URL parameters
  //   for (const parameter of endpoint.parameters) {
  //     if (!parameter.deprecated || parameter.in !== "PATH") continue;
  //     const { alias, name } = parameter;
  //     const deprecatedRoute = route.replace(
  //       new RegExp(`\\{${alias}\\}`),
  //       `{${name}}`
  //     );

  //     endpointsByRoute[deprecatedRoute] = Object.assign(
  //       {},
  //       endpointsByRoute[route],
  //       {
  //         deprecated: `"${name}" is now "${alias}"`,
  //       }
  //     );
  //   }
  // }

  // const result = template({
  //   endpointsByRoute: sortKeys(endpointsByRoute, { deep: true }),
  // });

  // writeFileSync(
  //   DECLARATIONS_PATH,
  //   prettier.format(result, { parser: "typescript" })
  // );
  // console.log(`${DECLARATIONS_PATH} updated.`);
}

function toOpenApiUrl(endpoint) {
  return (
    endpoint.url
      // stecial case for "Upload a release asset": remove ":origin" prefix
      .replace(/^\{origin\}/, "")
      // remove query parameters
      .replace(/\{?\?.*$/, "")
  );
}

function toRequiredPreviewName(operation) {
  if (!operation["x-github"].previews) return;

  const requiredPreviews = operation["x-github"].previews.filter(
    (preview) => preview.required
  );

  if (requiredPreviews.length === 0) return;

  return requiredPreviews[0].name;
}

function toVersions(filename) {
  const [, part1, part2] = filename.match(/^(.*)\.diff-to-(.*)\.deref\.json$/);
  const VERSION_MAP = {
    "api.github.com": "github.com",
  };

  return [VERSION_MAP[part1] || part1, VERSION_MAP[part2] || part2];
}
