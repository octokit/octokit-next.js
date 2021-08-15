import { Octokit } from "@octokit-next/core";

import "@octokit-next/types-rest-api-ghes-3.0";

function expectType<T>(value: T): void {}

export async function test() {
  const octokit = new Octokit({
    version: "ghes-3.1",
  });
  expectType<"ghes-3.1">(octokit.options.version);

  const response = await octokit.request("GET /ghes-only");

  expectType<boolean>(response.data.ok);

  const OctokitGHES31 = Octokit.withDefaults({
    version: "ghes-3.1",
  });
  expectType<"ghes-3.1">(OctokitGHES31.defaults.version);
  const octokitGhes31 = new OctokitGHES31();
  expectType<"ghes-3.1">(octokitGhes31.options.version);
  expectType<never>(await octokitGhes31.request("GET /dotcom-only"));

  expectType<{
    "+1": string;
    "-1": string;
    "ghes-only": string;
    "dotcom-only": never;
  }>((await octokitGhes31.request("GET /emojis")).data);

  const octokitGhes30ViaConstructorOptions = new OctokitGHES31({
    version: "ghes-3.0",
  });
  expectType<"ghes-3.0">(octokitGhes30ViaConstructorOptions.options.version);

  expectType<never>(
    await octokitGhes30ViaConstructorOptions.request("GET /new-ghes-only")
  );
  expectType<{
    "+1": string;
    "-1": string;
    "ghes-only": string;
    "dotcom-only": never;
  }>((await octokitGhes30ViaConstructorOptions.request("GET /emojis")).data);

  const OctokitGHES30 = OctokitGHES31.withDefaults({
    version: "ghes-3.0",
  });
  const octokitGhes30ViaChainedDefaults = new OctokitGHES30();
  expectType<never>(
    await octokitGhes30ViaChainedDefaults.request("GET /new-ghes-only")
  );
  expectType<{
    "+1": string;
    "-1": string;
    "ghes-only": string;
    "dotcom-only": never;
  }>((await octokitGhes30ViaChainedDefaults.request("GET /emojis")).data);
}
