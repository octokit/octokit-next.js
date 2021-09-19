const { readFileSync, writeFileSync } = require("fs");
const { resolve } = require("path");

const Handlebars = require("handlebars");
const prettier = require("prettier");
const sortKeys = require("sort-keys");

const ENDPOINTS = require("../../cache/types-rest-api/endpoints.json");
const DECLARATIONS_PATH = resolve(
  __dirname,
  "../../packages/types-rest-api/index.d.ts"
);
const DECLARATIONS_TEMPLATE_PATH = resolve(
  __dirname,
  "templates/index.d.ts.template"
);

const template = Handlebars.compile(
  readFileSync(DECLARATIONS_TEMPLATE_PATH, "utf8")
);

const endpointsByRoute = {};

run();

async function run() {
  for (const endpoint of ENDPOINTS) {
    if (endpoint.renamed) continue;

    const route = `${endpoint.method} ${endpoint.url}`;

    endpointsByRoute[route] = {
      method: endpoint.method.toLowerCase(),
      url: toOpenApiUrl(endpoint),
      requiredPreview: (endpoint.previews[0] || {}).name,
      documentationUrl: endpoint.documentationUrl,
    };

    // handle deprecated URL parameters
    for (const parameter of endpoint.parameters) {
      if (!parameter.deprecated || parameter.in !== "PATH") continue;
      const { alias, name } = parameter;
      const deprecatedRoute = route.replace(
        new RegExp(`\\{${alias}\\}`),
        `{${name}}`
      );

      endpointsByRoute[deprecatedRoute] = Object.assign(
        {},
        endpointsByRoute[route],
        {
          deprecated: `"${name}" is now "${alias}"`,
        }
      );
    }
  }

  const result = template({
    endpointsByRoute: sortKeys(endpointsByRoute, { deep: true }),
  });

  writeFileSync(
    DECLARATIONS_PATH,
    prettier.format(result, { parser: "typescript" })
  );
  console.log(`${DECLARATIONS_PATH} updated.`);
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
