# octokit-next.js

> Experimental Octokit SDK for exploration only - DO NOT USE 🚫⚠️

[![Build Status](https://github.com/octokit/octokit-next.js/workflows/Test/badge.svg)](https://github.com/octokit/octokit-next.js/actions/workflows/test.yml)

We use this repository to implement new features without the legacy of the current `Octokit` implementation.

This project is built as a monorepo using [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces/) and is publishing native ES Modules. To set it up and run the tests
Node 16 and npm 7 are required.

Currently working on:

- [ ] [octokit/octokit.js#2127](https://github.com/octokit/octokit.js/issues/2127) - Separate types from code and make types composable/extendable
- [ ] [octokit/octokit.js#2128](https://github.com/octokit/octokit.js/issues/2128) - Transition to native ES Modules + TypeScript declaration files

## Usage

⚠️ This is an experimental SDK not meant for actual usage.

```js
import { Octokit } from "octokit-next";

const octokit = new Octokit();

const { data } = await octokit.request("GET /repos/{owner}/{repo}", {
  owner: "octokit",
  repo: "octokit-next.js",
});

console.log(data);
```

## Known issues

- Constructor option Types (`options.auth`) are not set correctly when `authStrategy` is set via `.withDefaults({ authStrategy })` ([#20](https://github.com/octokit/octokit-next.js/issues/20))

## License

[MIT](LICENSE)
