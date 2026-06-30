import fs from "node:fs";
import path from "node:path";
import mime from "mime-types";
import { pipeline } from "node:stream/promises";

const ASSET_ROOT = "assets";

// streaming file
export const streamFile = awslambda.streamifyResponse(
  async (event, responseStream, context) => {
    const rawPath = decodeURIComponent(event.rawPath || "/");
    const normalizedPath = path.normalize(rawPath).replace(/^(\.\.[/\\])+/, "");
    const relativePath = normalizedPath.replace(/^[/\\]+/, "");

    const filePath = path.join(ASSET_ROOT, path.join("/", relativePath));

    if (!fs.existsSync(filePath)) {
      const metadata = {
        statusCode: 404,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      };
      responseStream = awslambda.HttpResponseStream.from(
        responseStream,
        metadata,
      );
      responseStream.write("file not found!");
      responseStream.end();
      return;
    }

    const isDirectory = fs.statSync(filePath).isDirectory();

    if (isDirectory) {
      const dirItems = fs.readdirSync(filePath, { withFileTypes: true });
      const body = `<ul>
        ${dirItems
          .map((dirItem) => {
            const itemName = dirItem.name;
            const itemUrl = path.join(rawPath, encodeURIComponent(itemName));
            return `<li><a href="${itemUrl}">${itemName}</a></li>`;
          })
          .join("\n")}
      </ul>
      `;

      const metadata = {
        statusCode: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      };
      responseStream = awslambda.HttpResponseStream.from(
        responseStream,
        metadata,
      );
      responseStream.write(body);
      responseStream.end();
      return;
    }

    const filename = path.basename(filePath);
    const mimeType = mime.lookup(filePath) || "application/octet-stream";

    const metadata = {
      statusCode: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    };
    responseStream = awslambda.HttpResponseStream.from(
      responseStream,
      metadata,
    );

    const fileStream = fs.createReadStream(filePath);
    await pipeline(fileStream, responseStream);
  },
);

export const sendFile = (event) => {
  const rawPath = decodeURIComponent(event.rawPath || "/");
  const normalizedPath = path.normalize(rawPath).replace(/^(\.\.[/\\])+/, "");
  const relativePath = normalizedPath.replace(/^[/\\]+/, "");

  const filePath = decodeURIComponent(
    path.join(ASSET_ROOT, path.join("/", relativePath)),
  );

  if (!fs.existsSync(filePath))
    return {
      statusCode: 404,
      headers: { "Content-Type": "text/plain" },
      body: "file not found!",
    };

  const isDirectory = fs.statSync(filePath).isDirectory();

  if (isDirectory) {
    const dirItems = fs.readdirSync(filePath, { withFileTypes: true });
    const body = `<ul>
        ${dirItems
          .map((dirItem) => {
            const itemName = dirItem.name;
            const itemUrl = path.join(rawPath, encodeURIComponent(itemName));
            return `<li><a href="${itemUrl}">${itemName}</a></li>`;
          })
          .join("\n")}
      </ul>
      `;
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
      body,
    };
  }

  const filename = path.basename(filePath);
  const mimeType = mime.lookup(filePath);

  const data = fs.readFileSync(filePath, "base64");
  return {
    statusCode: 200,
    headers: {
      "Content-Type": mimeType,
      "Content-Disposition": `inline; filename="${filename}"`,
    },
    body: data,
    isBase64Encoded: true,
  };
};
