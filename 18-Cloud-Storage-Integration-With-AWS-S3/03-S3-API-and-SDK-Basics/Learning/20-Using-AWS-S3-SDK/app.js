/*
Node.js Application
      ↓
AWS SDK (S3Client)
      ↓
Load credentials from AWS profile (~/.aws/credentials)
      ↓
Request signed using AWS Signature Version 4
      ↓
Request sent to Amazon S3 API
      ↓
AWS checks IAM permissions
      ↓
Response returned to application

->Concept Summary
This code:

Creates an S3 client using credentials from a named AWS profile.
Builds a ListBucketsCommand representing the S3 API operation.
Sends the command through the AWS SDK using client.send().
The SDK signs the request with AWS Signature V4 for authentication.
AWS IAM permissions determine whether the request is allowed.
If authorized, S3 returns the list of buckets.

- auto gets the credentials if not provided in the code, from system credentials

- if 'profile' option give then tries to fetch that particulat profile's credentials from the credentials file else fetches the default one
*/

import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client();

const command = new ListBucketsCommand();

const res = await s3Client.send(command);
console.log(res);
