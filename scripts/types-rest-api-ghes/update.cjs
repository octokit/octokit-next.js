const { readdirSync, readFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");

const Handlebars = require("handlebars");
const prettier = require("prettier");
const sortKeys = require("sort-keys");

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

run();

async function run() {
  const diffFiles = readdirSync("cache/types-rest-api-ghes");

  for (const diffFile of diffFiles) {
    const [currentVersion, diffVersion] = toVersions(diffFile);
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

    const declarationsPath = resolve(
      `packages/types-rest-api-${currentVersion}/index.d.ts`
    );

    writeFileSync(
      declarationsPath,
      prettier.format(result, { parser: "typescript" })
    );
    console.log(`${declarationsPath} updated.`);

    // TODO
    //
    // - delete the package folder and recreate it with all its files
    // - add the respective `@octokit-next/types-openapi-ghes-*` package as dependency with version set to `0.0.0-develpoment`
    // - install `semantic-release-plugin-update-version-in-files` and replace the versions in `packages/*/package.json` files
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
