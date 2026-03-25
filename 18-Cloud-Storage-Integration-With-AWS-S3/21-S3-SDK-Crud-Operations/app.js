import path from "node:path";
import {
  CopyObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeletePublicAccessBlockCommand,
  GetPublicAccessBlockCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutBucketPolicyCommand,
  PutObjectCommand,
  PutPublicAccessBlockCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { createReadStream } from "node:fs";

const s3Client = new S3Client();

/*
const command = new ListBucketsCommand();
const command = new CreateBucketCommand({
    Bucket:"bucket-3"
    })
const command = new GetPublicAccessBlockCommand({ Bucket: "raquib-bucket-3" });
const command = new DeletePublicAccessBlockCommand({
  Bucket: "raquib-bucket-3",
});
const command = new PutPublicAccessBlockCommand({
  Bucket: "raquib-bucket-3",
  PublicAccessBlockConfiguration: {
    BlockPublicAcls: false,
    BlockPublicPolicy: false,
    IgnorePublicAcls: false,
    RestrictPublicBuckets: false,
  },
});

const policy = {
  Version: "2012-10-17",
  Statement: [
    {
      Sid: "PublicReadGetObject",
      Effect: "Allow",
      Principal: "*",
      Action: "s3:GetObject",
      Resource: "arn:aws:s3:::raquib-bucket-3/*",
    },
  ],
};
const command = new PutBucketPolicyCommand({
  Bucket: "raquib-bucket-3",
  Policy: JSON.stringify(policy),
});
const command = new ListObjectsV2Command({
  Bucket: "raquib-bucket-3",
//   Prefix: "/",
});

const filename = "Recording.m4a";
const readStream = createReadStream("/home/raquib/Downloads/Recording.m4a");
const command = new PutObjectCommand({
  Bucket: "raquib-bucket-3",
  Key: filename,
  Body: readStream,
  ContentType: "audio/m4a",
});
*/

const files = [
  { RenameSource: "Recording.m4a", Key: "contents/Recording.m4a" },
  { RenameSource: "what-to-do-when.pdf", Key: "contents/what-to-do-when.pdf" },
];
async function RenameObjects(bucketName, objects) {
  for (const f of objects) {
    console.log(
      await s3Client.send(
        new CopyObjectCommand({
          Bucket: bucketName,
          Key: f.Key,
          CopySource: path.posix.join(bucketName, f.RenameSource),
        }),
      ),
    );

    console.log(
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: f.RenameSource,
        }),
      ),
    );
  }
}