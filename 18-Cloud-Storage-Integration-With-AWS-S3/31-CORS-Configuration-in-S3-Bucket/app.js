import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client();

const command = new PutObjectCommand({
  Bucket: "bucket_name",
  Key: "hello-world-2.png",
  ContentType: "image/png",
});

const signedUrl = await getSignedUrl(s3Client, command, {
  expiresIn: 5 * 60,
  signableHeaders: new Set(["content-type"]),
});

console.log(signedUrl);
