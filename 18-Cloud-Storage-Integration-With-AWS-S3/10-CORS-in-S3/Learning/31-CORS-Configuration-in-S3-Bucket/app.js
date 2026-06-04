import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client();

const command = new PutObjectCommand({
  Bucket: "bucket_name",
  Key: "image-1.png",
  ContentLength: 106764,
});

const signedUrl = await getSignedUrl(s3Client, command, {
  expiresIn: 5 * 60,
  signableHeaders: new Set(["content-length"]),
});

console.log(signedUrl);
  