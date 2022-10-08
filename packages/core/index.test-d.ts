import { expectType, expectNotType } from "tsd";

import { Octokit } from "./index.js";

declare module "@octokit-next/types" {
  namespace Octokit {
    interface Endpoints {
      /**
       * Dummy endpoint for testing purposes
       */
      "GET /endpoint-test/{id}": {
        parameters: {
          id: string;
        };
        request: {
          method: "GET";
          // the resulting `.url` property will replace the `{}` placeholders, so the type must be a generic string
          url: string;
        };
        response: Octokit.Response<
          {
            test: 1;
          },
          200
        >;
      };
    }

    interface ApiVersions {
      "endpoint-test": {
        Endpoints: Octokit.Endpoints & {
          "POST /endpoint-test/{id}/version-test": {
            parameters: {
              id: string;
              test: string;
            };
            request: {
              method: "POST";
              url: string;
              data: {
                test: string;
              };
            };
            response: Octokit.Response<
              {
                test: 2;
              },
              201
            >;
          };
        };
      };
    }
  }
}

export async function readmeExample() {
  const octokit = new Octokit({ auth: `personal-access-token123` });

  const response = await octokit.request("GET /endpoint-test/{id}", {
    id: "id",
  });

  expectType<200>(response.status);
  expectType<1>(response.data.test);
  expectType<string>(response.url);
  expectType<Octokit.ResponseHeaders>(response.headers);
}

export function hookTest() {
  const octokit = new Octokit();

  octokit.hook.before("request", () => {});
}

export function pluginsTest() {
  // `octokit` instance does not permit unknown keys
  const octokit = new Octokit();

  // @ts-expect-error Property 'unknown' does not exist on type 'Octokit'.(2339)
  octokit.unknown;

  const OctokitWithDefaults = Octokit.withDefaults({});
  const octokitWithDefaults = new OctokitWithDefaults();

  // Error: `octokitWithDefaults` does permit unknown keys
  // @ts-expect-error `.unknown` should not be typed as `any`
  octokitWithDefaults.unknown;

  const OctokitWithPlugin = Octokit.withPlugins([() => ({})]);
  const octokitWithPlugin = new OctokitWithPlugin();

  // Error: `octokitWithPlugin` does permit unknown keys
  // @ts-expect-error `.unknown` should not be typed as `any`
  octokitWithPlugin.unknown;

  const OctokitWithPluginAndDefaults = Octokit.withPlugins([
    () => ({
      foo: 42,
    }),
  ]).withDefaults({
    baz: "daz",
  });

  const octokitWithPluginAndDefaults = new OctokitWithPluginAndDefaults();

  octokitWithPluginAndDefaults.foo;
  // @ts-expect-error `.unknown` should not be typed as `any`
  octokitWithPluginAndDefaults.unknown;

  // https://github.com/octokit/octokit.js/issues/2115
  const OctokitWithVoidAndNonVoidPlugins = Octokit.withPlugins([
    () => ({ foo: "foo" }),
    () => {},
    () => ({ bar: "bar" }),
  ]);
  const octokitWithVoidAndNonVoidPlugins =
    new OctokitWithVoidAndNonVoidPlugins();

  expectNotType<void>(octokitWithVoidAndNonVoidPlugins);
  expectType<string>(octokitWithVoidAndNonVoidPlugins.foo);
  expectType<string>(octokitWithVoidAndNonVoidPlugins.bar);
}
