import { expectType } from "tsd";

import { OctokitAllEndpoints } from "./index.js";

export async function test() {
  new OctokitAllEndpoints({});

  const octokit = new OctokitAllEndpoints({
    baseUrl: "https://github.acme-inc.com/api/v3",
  });

  const rootResponse = await octokit.request("GET /");
  expectType<string>(rootResponse.data.emojis_url);
  // @ts-expect-error - invalid keys
  rootResponse.data.unknown;

  const licenseResponse = await octokit.request("GET /licenses/{license}", {
    license: "",
  });
  expectType<string>(licenseResponse.data.body);
  expectType<boolean>(licenseResponse.data.featured);

  // @ts-expect-error - invalid keys
  licenseResponse.data.unknown;
}
