import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({ profile: "default" });

// const command = new GetObjectCommand({
//   Bucket: "raquibs-bucket",
//   Key: "my-js-resume.pdf",
// });
// const url = await getSignedUrl(s3Client, command);

// const command = new PutObjectCommand({
//   Bucket: "raquibs-bucket",
//   Key: "Resume_full_stack_dev.pdf",
//   ContentType: "application/pdf",
// });
// const url = await getSignedUrl(s3Client, command, {
//   expiresIn: 5 * 60,
//   signableHeaders: new Set(["content-type"]), //small-case required!
// });

const command = new DeleteObjectCommand({
  Bucket: "raquibs-bucket",
  Key: "Resume_full_stack_dev.pdf",
});
const url = await getSignedUrl(s3Client, command, {
  expiresIn: 5 * 60,
});

console.log(url);
