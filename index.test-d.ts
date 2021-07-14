import { expectType } from "tsd";
import { Octokit } from "./index.js";

const octokit = new Octokit();

expectType<() => void>(octokit.request);
