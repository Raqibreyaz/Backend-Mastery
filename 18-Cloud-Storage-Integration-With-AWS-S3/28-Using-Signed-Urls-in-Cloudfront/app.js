// Private Key: openssl genrsa -out private_key.pem 2048
// Public Key: openssl rsa -in private_key.pem -pubout -out public_key.pem

import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { readFile } from "node:fs/promises";

const url = `https://d2f0fwnpw5spve.cloudfront.net/index.html`;
const privateKey = await readFile("./private_key.pem", "utf-8");

const keyPairId = "KB3ZAJCYCQN4R";
const dateLessThan = new Date(Date.now() + 20 * 1000).toISOString();

const signedUrl = getSignedUrl({
  url,
  keyPairId,
  dateLessThan,
  privateKey,
});

console.log(signedUrl);
