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

run();

async function run() {
  await rm("cache/types-rest-api-diff", { recursive: true });
  await mkdir("cache/types-rest-api-diff");

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
    if (!file.name.includes("-anicca-diff-to-")) continue;

    // ignore GHES 2.x
    if (file.name.startsWith("ghes-2")) {
      continue;
    }

    await download(version, file.name);
  }

  function download(version, fileName) {
    const localPath = `cache/types-rest-api-diff/${fileName}`;

    const file = createWriteStream(localPath);
    const url = `https://unpkg.com/@octokit/openapi@${version}/generated/${fileName}`;

    console.log("Downloading %s to %s", url, localPath);

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
}
