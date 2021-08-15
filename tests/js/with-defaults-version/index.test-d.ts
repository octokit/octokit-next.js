import { expectType } from "tsd";
import { Octokit } from "@octokit-next/core";

import "@octokit-next/types-rest-api-ghes-3.0";

export async function test() {
  const octokitCoreWithGhes31Version = new Octokit({
    version: "ghes-3.1",
  });

  const response = await octokitCoreWithGhes31Version.request("GET /ghes-only");

  expectType<boolean>(response.data.ok);

  const OctokitGHES31 = Octokit.withDefaults({
    version: "ghes-3.1",
  });
  const octokitGhes31 = new OctokitGHES31();
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
