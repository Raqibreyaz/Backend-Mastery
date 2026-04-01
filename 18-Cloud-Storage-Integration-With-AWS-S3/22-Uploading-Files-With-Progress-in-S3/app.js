import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import path from "node:path";
import { createReadStream } from "node:fs";

const s3Client = new S3Client({});

const filepath = "/home/raquib/Downloads/AC227P054.pdf";
const filename = path.basename(filepath);
const readStream = createReadStream(filepath);

const upload = new Upload({
  client: s3Client,
  params: {
    Bucket: "raquib-bucket-3",
    Key: filename,
    Body: readStream,
    // ContentType: "",
  },
  partSize: 5 * 1024 * 1024,
});

upload.on("httpUploadProgress", (progress) => {
  console.log(((progress.loaded / progress.total) * 100).toFixed(2) + "%");
});

const completeMultiPartUpload = await upload.done();
console.log(completeMultiPartUpload);
