import { Base } from "javascript-plugin-architecture-with-typescript-definitions";
import { requestPlugin } from "./plugins/request/index.js";

export const Octokit = Base.withPlugins([requestPlugin]).withDefaults({
  baseUrl: "https://api.github.com",
});
