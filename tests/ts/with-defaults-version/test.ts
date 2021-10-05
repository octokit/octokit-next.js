import { Octokit } from "@octokit-next/core";

import "@octokit-next/types-rest-api-ghes-3.0";

function expectType<T>(value: T): void {}

export async function test() {
  const octokit = new Octokit({
    version: "ghes-3.1",
  });
  expectType<"ghes-3.1">(octokit.options.version);

  const response = await octokit.request("GET /admin/hooks/{hook_id}", {
    hook_id: 1,
    mediaType: {
      previews: ["superpro"],
    },
  });

  expectType<number | undefined>(response.data.id);

  const OctokitGHES31 = Octokit.withDefaults({
    version: "ghes-3.1",
  });
  expectType<"ghes-3.1">(OctokitGHES31.defaults.version);
  const octokitGhes31 = new OctokitGHES31();
  expectType<"ghes-3.1">(octokitGhes31.options.version);

  // @ts-expect-error - `GET /marketplace_listing/plans` only exists on `github.com`
  await octokitGhes31.request("GET /marketplace_listing/plans");

  // TODO: make changed properties work (#28)
  // // The `api` key was removed for GHES versions, but
  // // the `installed_version` key was added.
  // const metaResponse = await octokitGhes31.request("GET /meta");
  // expectType<string>(metaResponse.data.installed_version);
  // expectType<never>(metaResponse.data.api);

  const octokitGhes30ViaConstructorOptions = new OctokitGHES31({
    version: "ghes-3.0",
  });
  expectType<"ghes-3.0">(octokitGhes30ViaConstructorOptions.options.version);

  // @ts-expect-error - `GET /orgs/{org}/audit-log` was added in GHES 3.1 and does not exist in GHES 3.0
  await octokitGhes30ViaConstructorOptions.request("GET /orgs/{org}/audit-log");

  // TODO: make changed properties work (#28)
  // const metaResponseGhes30 = await octokitGhes30ViaConstructorOptions.request(
  //   "GET /meta"
  // );
  // expectType<string>(metaResponseGhes30.data.installed_version);
  // expectType<never>(metaResponseGhes30.data.api);

  const OctokitGHES30 = OctokitGHES31.withDefaults({
    version: "ghes-3.0",
  });
  const octokitGhes30ViaChainedDefaults = new OctokitGHES30();
  // @ts-expect-error - `GET /orgs/{org}/audit-log` was added in GHES 3.1 and does not exist in GHES 3.0
  await octokitGhes30ViaChainedDefaults.request("GET /orgs/{org}/audit-log");

  const metaResponseGhes30chained =
    await octokitGhes30ViaChainedDefaults.request("GET /meta");

  // TODO: make changed properties work (#28)
  // expectType<string>(metaResponseGhes30chained.data.installed_version);
  // expectType<never>(metaResponseGhes30chained.data.api);
}
