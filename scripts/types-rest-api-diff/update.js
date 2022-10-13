import { readFileSync } from "node:fs";
import { readdir, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import Handlebars from "handlebars";
import prettier from "prettier";
import sortKeys from "sort-keys";

if (!process.env.OCTOKIT_OPENAPI_VERSION) {
  throw new Error("OCTOKIT_OPENAPI_VERSION is not set");
}

const DIFF_TO_DOTCOM_TEMPLATE_PATH = new URL(
  "templates/diff-to-github.com.d.ts.template",
  import.meta.url
).pathname;

const DIFF_TO_GHES_TEMPLATE_PATH = new URL(
  "templates/diff-to-ghes.d.ts.template",
  import.meta.url
).pathname;

const pkg = JSON.parse(readFileSync(resolve(process.cwd(), "package.json")));

const templateDiffToDotcom = Handlebars.compile(
  readFileSync(DIFF_TO_DOTCOM_TEMPLATE_PATH, "utf8")
);
const templateDiffToGHES = Handlebars.compile(
  readFileSync(DIFF_TO_GHES_TEMPLATE_PATH, "utf8")
);

const packageDefaults = {
  type: "module",
  publishConfig: {
    access: "public",
  },
  version: "0.0.0-development",
  types: "index.d.ts",
  // Add workaround for https://github.com/ije/esm.sh/issues/433
  exports: "./index.js",
  author: "Gregor Martynus (https://twitter.com/gr2m)",
  license: "MIT",
  octokit: {
    "openapi-version": process.env.OCTOKIT_OPENAPI_VERSION.replace(/^v/, ""),
  },
};

run();

async function run() {
  const diffFiles = await readdir("cache/types-rest-api-diff");

  for (const diffFile of diffFiles) {
    const [currentVersion, diffVersion] = toVersions(diffFile);
    const currentVersionName = currentVersion.replace("-", " ").toUpperCase();

    const packageName = `types-rest-api-${currentVersion}`;

    const diffPackageName =
      diffVersion === "github.com"
        ? `types-rest-api`
        : `types-rest-api-${diffVersion}`;
    const diffToPackageName = `types-openapi-${currentVersion}-diff-to-${
      diffVersion === "github.com" ? "api.github.com" : diffVersion
    }`;

    const packagePath = `packages/${packageName}`;

    // delete current package directory
    await rm(packagePath, { recursive: true, force: true });
    console.log("%s deleted", packagePath);

    // recreate package directory
    await mkdir(packagePath);
    console.log("%s created", packagePath);

    // create package.json
    await writeFile(
      `${packagePath}/package.json`,
      prettier.format(
        JSON.stringify(
          sortKeys(
            {
              name: `@octokit-next/${packageName}`,
              description: `Generated TypeScript definitions based on GitHub's OpenAPI spec for ${currentVersionName}`,
              ...packageDefaults,
              repository: {
                type: "git",
                url: "https://github.com/octokit/octokit-next.js.git",
                directory: packagePath,
              },
              homepage: `https://github.com/octokit/octokit-next.js/tree/main/${packagePath}#readme`,
              dependencies: {
                "@octokit-next/types": "0.0.0-development",
                [`@octokit-next/types-openapi-${currentVersion}`]:
                  "0.0.0-development",
                "@octokit-next/types-rest-api": "0.0.0-development",
                [`@octokit-next/${diffPackageName}`]: "0.0.0-development",
                [`@octokit-next/${diffToPackageName}`]: "0.0.0-development",
                "type-fest": pkg.devDependencies["type-fest"],
              },
            },
            { deep: true }
          )
        ),
        { parser: "json-stringify" }
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
    const diffPathName = "cache/types-rest-api-diff/" + diffFile;
    console.log("Reading paths from %s", diffPathName);
    const { paths } = JSON.parse(readFileSync(diffPathName, "utf8"));

    const removedEndpointsByRoute = {};

    if (paths["removed"]) {
      for (const [path, methods] of Object.entries(paths["removed"])) {
        for (const method of methods) {
          const route = [method.toUpperCase(), path].join(" ");
          removedEndpointsByRoute[route] = {
            // TODO: would be nice to get the documentation URL for the removed endpoint here
            // documentationUrl: operation.externalDocs.url,
          };
        }
      }
    }

    const addedEndpointsByRoute = {};
    if (paths["added"]) {
      for (const [path, methods] of Object.entries(paths["added"])) {
        for (const [method, operation] of Object.entries(methods)) {
          const route = [method.toUpperCase(), path].join(" ");

          addedEndpointsByRoute[route] = {
            method,
            url: toOpenApiUrl(path),
            requiredPreview: toRequiredPreviewName(operation),
            documentationUrl: operation.externalDocs?.url,
          };
        }
      }
    }
    const hasAddedEndpointsByRoute =
      Object.keys(addedEndpointsByRoute).length > 0;

    const template =
      diffVersion === "github.com" ? templateDiffToDotcom : templateDiffToGHES;

    const result = template({
      currentVersion,
      diffVersion,
      addedEndpointsByRoute: sortKeys(addedEndpointsByRoute, {
        deep: true,
      }),
      hasAddedEndpointsByRoute,
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

    // Add workaround for https://github.com/ije/esm.sh/issues/433
    const indexPath = resolve(`${packagePath}/index.js`);
    await writeFile(
      indexPath,
      'export default "Workaround for https://github.com/ije/esm.sh/issues/433";\n'
    );
    console.log(`${indexPath} updated.`);

    // create *-compatible package
    const packageCompatibleName = `types-rest-api-${currentVersion}-compatible`;
    const packageCompatiblePath = `packages/${packageCompatibleName}`;

    // delete current package directory
    await rm(packageCompatiblePath, { recursive: true, force: true });
    console.log("%s deleted", packageCompatiblePath);

    // recreate package directory
    await mkdir(packageCompatiblePath);
    console.log("%s created", packageCompatiblePath);

    // create package.json
    await writeFile(
      `${packageCompatiblePath}/package.json`,
      prettier.format(
        JSON.stringify(
          sortKeys(
            {
              name: `@octokit-next/${packageCompatibleName}`,
              description: `Types for ${currentVersionName} (compatible) REST API requests and responses`,
              repository: {
                type: "git",
                url: "https://github.com/octokit/octokit-next.js.git",
                directory: packageCompatiblePath,
              },
              homepage: `https://github.com/octokit/octokit-next.js/tree/main/${packageCompatiblePath}#readme`,
              dependencies: {
                "@octokit-next/types": "0.0.0-development",
                [`@octokit-next/types-openapi-${currentVersion}`]:
                  "0.0.0-development",
              },
              ...packageDefaults,
            },
            { deep: true }
          )
        ),
        { parser: "json-stringify" }
      )
    );
    console.log("%s updated", `${packageCompatiblePath}/package.json`);

    // create README.md
    await writeFile(
      `${packageCompatiblePath}/README.md`,
      prettier.format(
        `
# \`@octokit-next/${packageCompatibleName}\`

> Types for ${currentVersionName} (compatible) REST API requests and responses

🚫⚠️ This package is part of an experimental Octokit SDK for testing purpose only - DO NOT USE

[learn more](https://github.com/octokit/octokit-next.js)

The goal for this package is to enable developers to build code that will work in both environments: github.com and ${currentVersionName}. Only endpoints and properties that exist in both have types by default.

The version can be overwritten on a per-request basis as needed.

## Usage

\`\`\`ts
const octokit = new Octokit({
  version: "${currentVersion}-compatible",
});
const response = await octokit.request("GET /");
\`\`\`

The routes suggested for \`octokit.request(route)\` are only the ones that exist for \`version: "github.com"\` and have no overrides for \`version: "${currentVersion}"\`. The same is true for \`response.headers\`.

To override the version specified in the constructor it can be set using the \`request.version\` option

\`\`\`ts
const ghesOnlyResponse = await octokit.request("GET /admins/users", {
  request: {
    version: "${currentVersion}",
  },
});
\`\`\`
        
        
`,
        { parser: "markdown" }
      )
    );
    console.log("%s updated", `${packageCompatiblePath}/README.md`);

    const declarationsCompatiblePath = resolve(
      `${packageCompatiblePath}/index.d.ts`
    );

    await writeFile(
      declarationsCompatiblePath,
      prettier.format(
        `
import { Octokit } from "@octokit-next/types";

import {
  RemovedRoutes,
  ResponseHeadersDiff,
} from "@octokit-next/${packageName}";

export type ResponseHeadersCompatible = Omit<
  Octokit.ResponseHeaders,
  keyof ResponseHeadersDiff
>;

export type EndpointsCompatible = Omit<Octokit.Endpoints, RemovedRoutes>;

declare module "@octokit-next/types" {
  namespace Octokit {
    interface ApiVersions {
      "${currentVersion}-compatible": {
        ResponseHeaders: ResponseHeadersCompatible;

        Endpoints: {
          [route in keyof EndpointsCompatible]: {
            parameters: EndpointsCompatible[route]["parameters"];
            response: Octokit.Response<
              EndpointsCompatible[route]["response"]["data"],
              EndpointsCompatible[route]["response"]["status"],
              ResponseHeadersCompatible
            >;
          };
        };
      };
    }
  }
}       
`,
        { parser: "typescript" }
      )
    );
    console.log(`${declarationsCompatiblePath} updated.`);

    // Add workaround for https://github.com/ije/esm.sh/issues/433
    const compatibleIndexPath = resolve(`${packageCompatiblePath}/index.js`);
    await writeFile(
      compatibleIndexPath,
      'export default "Workaround for https://github.com/ije/esm.sh/issues/433";\n'
    );
    console.log(`${compatibleIndexPath} updated.`);
  }
}

function toOpenApiUrl(url) {
  return (
    url
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
  const [, part1, part2] = filename.match(
    /^(.*)-anicca-diff-to-(.*)\.deref\.json$/
  );
  const VERSION_MAP = {
    "api.github.com": "github.com",
  };

  return [VERSION_MAP[part1] || part1, VERSION_MAP[part2] || part2];
}
