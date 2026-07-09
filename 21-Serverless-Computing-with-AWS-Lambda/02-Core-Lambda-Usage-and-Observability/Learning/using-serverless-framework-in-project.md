Serverless Framework in Video-Streaming Project

## Architecture & Usage
- **Multiple Services**: The project employs a multi-service approach with two separate Serverless definitions (`httpLambda` and `videoTranscodingLambda`), each containing a `serverless.ts` configuration leveraging `@serverless/typescript`.
- **API Gateway**: `httpLambda` is configured to handle HTTP API events with extensive CORS configuration directly within `serverless.ts` (defining allowed origins, methods, and exposed headers like `Set-Cookie`).
- **S3 Event Triggers**: `videoTranscodingLambda` is triggered asynchronously via an S3 `s3:ObjectCreated:*` event on a pre-existing temporary bucket (`temp-bucket-raquib`).

## Learnings, Issues & Gotchas
- **S3 Existing Bucket Limitation**: When attaching an S3 trigger to an *existing* bucket (using `existing: true`), CloudFormation cannot natively add the event notification because the bucket wasn't created in its stack. Serverless Framework handles this by deploying an extra "mini" custom resource Lambda function (e.g., `*-custom-resource-existing-s3`). This function executes the AWS SDK `PutBucketNotificationConfiguration` to link the bucket to your Lambda.
- **S3 Object Creation Events**: It's crucial to use `s3:ObjectCreated:*` rather than just `s3:ObjectCreated:Put`. Uploads initiated from the AWS Console versus the CLI or SDK can trigger different event types (like `CompleteMultipartUpload`), so `*` ensures all new objects are captured.
- **Deployment Artifacts Cleanup**: By default, Serverless keeps historical deployments in an S3 bucket. To prevent bucket bloat and save costs, the `provider.deploymentBucket.maxPreviousDeploymentArtifacts` was explicitly set to `3`.
- **Package Size Optimization**: Lambda package sizes were strictly controlled using `package.individually: true` and defining explicit exclusion patterns (`!src`, `!tsconfig.json`, `!node_modules/@types/**`, `!node_modules/serverless`). This significantly reduced cold start times and artifact sizes.
- **IAM Roles**: The project uses pre-existing IAM roles (via the `role:` property) rather than letting Serverless generate them dynamically, ensuring strict adherence to the Principle of Least Privilege predefined in AWS IAM.
- **Symlink Issues in Zip Packaging**: Packaging `pnpm` based `node_modules` failed in the lambda runtime because the default zip mechanisms did not preserve `pnpm`'s symlinks correctly. The project was temporarily migrated to `npm`, which reduced the package size from ~26MB (with broken symlinks) to ~3MB due to how dependencies are flattened.

## General Considerations for Serverless Migration

- **Handling Heavy/Long-Running Tasks (The Orchestrator Pattern)**:
  AWS Lambda has a strict maximum timeout of 15 minutes, and API Gateway has a timeout of 30 seconds. For heavy, compute-intensive workloads (like video transcoding in this project), you should *not* run them directly in Lambda. Instead, use Lambda as an orchestrator to trigger an AWS ECS Fargate container or AWS Batch job. This is exactly why `videoTranscodingLambda` passes the `CLUSTER_ARN` and `TASK_DEFINITION_ARN`—it delegates the heavy lifting.

- **Managing Database Connections**:
  In a traditional Express.js app, you establish a database connection once when the server starts. In Serverless, many Lambda instances can spin up simultaneously, potentially exhausting your database's connection limits. 
  *Gotcha*: Always define your database connection *outside* the Lambda handler function so it can be reused across warm invocations, or consider using connection pooling proxies like AWS RDS Proxy or connectionless databases like DynamoDB.

- **Cold Starts**:
  When a Lambda hasn't been invoked for a while, AWS spins down the underlying container. The next request will experience a delay (a "cold start") as a new container is provisioned. 
  *Fix*: Keep your deployment packages as small as possible, avoid heavy synchronous imports at the top of your files, and consider AWS Provisioned Concurrency if you need guaranteed low-latency responses.

- **Statelessness is Mandatory**:
  You cannot rely on the local file system (like `/tmp`) or in-memory variables to persist data between requests. Two consecutive requests might be routed to entirely different Lambda containers. All state, sessions, and files must be externalized to managed services (e.g., Redis for sessions, S3 for files, DynamoDB/Postgres for state).

- **Handling Secrets & Environment Variables**:
  In a traditional server, you might use a `.env` file. In Serverless, passing raw secrets (like private keys) directly into the environment variables can cause parsing issues (e.g., `\n` characters breaking in CloudFront private keys). 
  *Fix*: Base64 encode multiline keys before storing them in the environment, or better yet, fetch them dynamically at runtime from AWS Secrets Manager or Parameter Store.

- **Granular IAM vs. Monolithic Roles**:
  It is tempting to give a Lambda function "AdminAccess" or full S3 access during a migration. However, Serverless architectures thrive on the Principle of Least Privilege. Every Lambda should have a specific role (e.g., `arn:aws:iam::...:role/put-to-temp-bucket-role`) that *only* allows it to do what it needs.

- **Cost at Scale**:
  Serverless is incredibly cheap (often free) at low-to-medium volume because you only pay for what you use. However, for continuous, extremely high-throughput, and predictable traffic, traditional EC2 or ECS can sometimes be more cost-effective. Always monitor your AWS Billing Dashboard and set up Budget Alerts early.