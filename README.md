# octokit-next.js

> Experimental Octokit SDK for exploration only - DO NOT USE 🚫⚠️

[![Build Status](https://github.com/octokit/octokit-next.js/workflows/Test/badge.svg)](https://github.com/octokit/octokit-next.js/actions/workflows/test.yml)

We use this repository to implement new features without the legacy of the current `Octokit` implementation.

This project is built as a monorepo using [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces/) and is publishing native ES Modules. To set it up and run the tests Node 18 is required.

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

## Breaking changes

A list of breaking changes compared to latest `@octokit/*` modules

- Node 16 and other JavaScript runtime environments that lack a global [`fetch()` method](https://developer.mozilla.org/en-US/docs/Web/API/fetch) are no longer supported out-of-the-box. A `fetch` method such as provided by the [`node-fetch` npm module](https://github.com/node-fetch/node-fetch) can be passed to make Octokit work in these environments.

  For `@octokit-next/core` and other SDKs built upon it you can do this

  ```js
  import { Octokit } from "octokit-next";
  import fetch from "node-fetch";

  const octokit = new Octokit({ request: { fetch } });
  ```

  For the static `@octokit-next/request` method you can do this

  ```js
  import { request } from "@octokit-next/request";
  import fetch from "node-fetch";

  const result = await request("GET /", { request: { fetch } });
  ```

- `Octokit.defaults` is now `Octokit.withDefaults`

- `Octokit.plugin` is now `Octokit.withPlugins`. Instead of accepting one argument per plugin, the method now accepts a single array argument with all plugins to be applied.

- `@octokit/openapi-types` will be renamed to `@octokit/types-openapi` to be consistents with the `@octokit/types-*` prefixed packages that only contain types

- `@octokit/auth-token`: `createTokenAuth()` no longer accepts a `token` string argument, but requires `options.token`.

- plugins now receive all options passed to the `Octokit` constructor as well as its defaults. Previously only the options passed to the constructor were passed

## Features

- `Octokit.DEFAULTS`
- `octokit.options`

## Notes for later

- replace `request.defaults()` and `endpoint.defaults()` with `request.withDefaults()` and `endpoint.withDefaults()`
- remove `options.previews` from `new Octokit(options)`
- Add script to verify that `packages/*` folders and `release.plugins` configuration in `package.json` are in sync
- `scripts/types-rest-api-diff/update.js` - remove all package folders before re-creating, so that obsolete packages get removed

## Known issues

- Constructor option Types (`options.auth`) are not set correctly when `authStrategy` is set via `.withDefaults({ authStrategy })` ([#20](https://github.com/octokit/octokit-next.js/issues/20))
- Endpoint types don't work if they changed between versions ([#28](https://github.com/octokit/octokit-next.js/issues/28))

## License

[MIT](LICENSE)
