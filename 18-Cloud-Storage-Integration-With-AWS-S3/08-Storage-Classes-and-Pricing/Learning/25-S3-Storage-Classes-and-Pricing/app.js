import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createReadStream } from "node:fs";

const s3Client = new S3Client();

const readStream = createReadStream(
  "/home/raquib/Downloads/reume_prathamesh.pdf",
);

const command = new PutObjectCommand({
  Bucket: "raquibs-bucket",
  Key: "resume.pdf",
  ContentType: "application/pdf",
  Body: readStream,
  StorageClass:"INTELLIGENT_TIERING"
});

const result = await s3Client.send(command);
console.log(result)
