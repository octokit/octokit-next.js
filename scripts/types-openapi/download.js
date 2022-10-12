import { get } from "node:https";
import { createWriteStream } from "node:fs";
import { mkdir, rm } from "node:fs/promises";

if (!process.env.OCTOKIT_OPENAPI_VERSION) {
  throw new Error("OCTOKIT_OPENAPI_VERSION is not set");
}

if (!process.env.GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN is not set");
}

const version = process.env.OCTOKIT_OPENAPI_VERSION.replace(/^v/, "");

await rm("cache/types-openapi", { recursive: true });
await mkdir("cache/types-openapi");

const data = await new Promise((resolve, reject) => {
  get(
    "https://api.github.com/repos/octokit/openapi/contents/generated?ref=main",
    {
      headers: {
        "user-agent": "octokit/octokit-next.js",
        authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    },
    (response) => {
      response.setEncoding("utf8");
      const data = [];
      response.on("data", (chunk) => {
        data.push(chunk);
      });
      response.on("end", () => {
        resolve(JSON.parse(data.join("")));
      });
      response.on("error", reject);
    }
  );
});

if (!Array.isArray(data)) {
  throw new Error(
    "https://github.com/octokit/openapi/tree/main/generated is not a directory"
  );
}

// download the OpenAPI spec for api.github.com
for (const file of data) {
  // ignore anicca files (https://github.com/xuorig/anicca)
  if (/anicca/.test(file.name)) {
    console.log("%s not supported", file.name);
    continue;
  }

  // ignore GHES 2.x files
  if (file.name.startsWith("ghes-2")) {
    console.log("%s not supported", file.name);
    continue;
  }

  // ignore deref files
  if (file.name.endsWith(".deref.json")) {
    console.log("%s not supported", file.name);
    continue;
  }

  // ignore non-json files
  if (!file.name.endsWith(".json")) {
    console.log("%s not supported", file.name);
    continue;
  }

  await download(version, file.name);
}

function download(version, fileName) {
  const localPath = `cache/types-openapi/${fileName}`;

  const file = createWriteStream(localPath);
  const url = `https://unpkg.com/@octokit/openapi@${version}/generated/${fileName}`;

  console.log("Downloading %s to localPath", url, localPath);

  return new Promise((resolve, reject) => {
    get(url, (response) => {
      response.pipe(file);
      file
        .on("finish", () =>
          file.close((error) => {
            if (error) return reject(error);
            console.log("%s written", localPath);
            resolve();
          })
        )
        .on("error", (error) => reject(error.message));
    });
  });
}
