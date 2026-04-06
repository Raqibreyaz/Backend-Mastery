import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";

const cloudFrontClient = new CloudFrontClient();

const command = new CreateInvalidationCommand({
  DistributionId: "E2RSIQPXQT61CN",
  InvalidationBatch: {
    CallerReference: "1235",
    Paths: {
      Quantity: 1,
      Items: ["/images/thumnail.png"],
    },
  },
});

const output = await cloudFrontClient.send(command);

console.log(output)
