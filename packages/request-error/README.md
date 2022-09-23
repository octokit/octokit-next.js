# request-error.js

> Error class for Octokit request errors

[![@latest](https://img.shields.io/npm/v/@octokit-next/request-error.svg)](https://www.npmjs.com/package/@octokit-next/request-error)
[![Build Status](https://github.com/octokit-next/request-error.js/workflows/Test/badge.svg)](https://github.com/octokit-next/request-error.js/actions?query=workflow%3ATest)

## Usage

<table>
<tbody valign=top align=left>
<tr><th>
Browsers
</th><td width=100%>
Load <code>@octokit-next/request-error</code> directly from <a href="https://cdn.skypack.dev">cdn.skypack.dev</a>
        
```html
<script type="module">
import { RequestError } from "https://cdn.skypack.dev/@octokit-next/request-error";
</script>
```

</td></tr>
<tr><th>
Node
</th><td>

Install with <code>npm install @octokit-next/request-error</code>

```js
import { RequestError } from "@octokit-next/request-error";
```

</td></tr>
</tbody>
</table>

```js
const error = new RequestError("Oops", 500, {
  request: {
    method: "POST",
    url: "https://api.github.com/foo",
    body: {
      bar: "baz",
    },
    headers: {
      authorization: "token secret123",
    },
  },
  response: {
    status: 500,
    url: "https://api.github.com/foo"
    headers: {
      "x-github-request-id": "1:2:3:4",
    },
    data: {
      foo: "bar"
    }
  },
});

error.message; // Oops
error.status; // 500
error.request; // { method, url, headers, body }
error.response; // { url, status, headers, data }
```

## LICENSE

[MIT](LICENSE)
