import { get } from "https";
import { createWriteStream } from "fs";
import { mkdir, rm } from "fs/promises";

if (!process.env.OCTOKIT_OPENAPI_VERSION) {
  throw new Error("OCTOKIT_OPENAPI_VERSION is not set");
}

if (!process.env.GITHUB_TOKEN) {
  throw new Error("GITHUB_TOKEN is not set");
}

const version = process.env.OCTOKIT_OPENAPI_VERSION.replace(/^v/, "");

await rm("cache/openapi", { recursive: true });
await mkdir("cache/openapi");

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

for (const file of data) {
  if (
    file.name !== "api.github.com.json" &&
    file.name !== "ghes-3.1.diff.json"
  ) {
    continue;
  }

  download(version, file.name);
}

function download(version, fileName) {
  const localPath = `cache/openapi/${fileName}`;

  const file = createWriteStream(localPath);
  const url = `https://unpkg.com/@octokit/openapi@${version}/generated/${fileName}`;

  console.log("Downloading %s", url);

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
