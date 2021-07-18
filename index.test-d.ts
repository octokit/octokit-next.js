import { expectType } from "tsd";
import { Octokit } from "./index.js";

export async function test() {
  const octokit = new Octokit({
    version: "",
  });
  const response = await octokit.request("GET /");

  expectType<number>(response.status);
  expectType<string>(response.url);
  expectType<string | undefined>(response.headers["x-ratelimit-limit"]);
  expectType<string>(response.data.emojis_url);
}
