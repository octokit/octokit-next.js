import { Octokit } from "@octokit-next/core";
import { expectType } from "tsd";

import "@octokit-next/types-rest-api-ghes-3.0";

export async function run() {
  const octokit = new Octokit({
    version: "ghes-3.1",
  });

  const response = await octokit.request("GET /ghes-only");

  expectType<boolean>(response.data.ok);

  const OctokitGHES31 = Octokit.withDefaults({
    version: "ghes-3.1",
  });
  const octokitGhes31 = new OctokitGHES31();
  expectType<never>(await octokitGhes31.request("GET /dotcom-only"));
  expectType<Octokit.Response<any, any>>(
    await octokitGhes31.request("GET /emojis")
  );

  const octokitGhes30ViaConstructorOptions = new OctokitGHES31({
    version: "ghes-3.0",
  });
  expectType<never>(
    await octokitGhes30ViaConstructorOptions.request("GET /new-ghes-only")
  );
  expectType<Octokit.Response<any, any>>(
    await octokitGhes30ViaConstructorOptions.request("GET /emojis")
  );

  const OctokitGHES30 = OctokitGHES31.withDefaults({
    version: "ghes-3.0",
  });
  const octokitGhes30ViaChainedDefaults = new OctokitGHES30();
  expectType<never>(
    await octokitGhes30ViaChainedDefaults.request("GET /new-ghes-only")
  );
  expectType<Octokit.Response<any, any>>(
    await octokitGhes30ViaChainedDefaults.request("GET /emojis")
  );
}
