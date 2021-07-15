import { expectType } from "tsd";
import { Octokit } from "./index.js";

export async function test() {
  const octokit = new Octokit({
    version: "ghes-3.1",
    baseUrl: "https://github.acme-inc.com/api/v3",
  });
  const response = await octokit.request("GET /");

  expectType<number>(response.status);
  expectType<string>(response.url);
  expectType<string | undefined>(
    response.headers["x-github-enterprise-version"]
  );
  expectType<string>(response.data.always_present);
  expectType<never>(response.data.dotcom_only);
  expectType<string>(response.data.ghe_only);
}
