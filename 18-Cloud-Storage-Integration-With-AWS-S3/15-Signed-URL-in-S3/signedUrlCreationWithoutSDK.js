import crypto from "node:crypto";

const bucketName   = "raquibs-bucket";
const objectPath   = "/my-js-resume.pdf";
const accessKeyId  = "access_id";
const secretKey    = "secret_key";
const region       = "ap-south-1";
const service      = "s3";
const signedHeaders = "host";
const expiry       = "30";

// Bug 2 fixed: strip milliseconds properly
const dateTime = new Date().toISOString()
  .replace(/[-:]/g, "")
  .replace(/\.\d{3}/, "");        // "20260324T021500Z"
const dateOnly = dateTime.slice(0, 8);  // "20260324"

// Bug 3 fixed: template literals, not path.join
const credentialScope = `${dateOnly}/${region}/${service}/aws4_request`;
const credential      = `${accessKeyId}/${credentialScope}`;
const host            = `${bucketName}.s3.${region}.amazonaws.com`;

const queryEntries = [
  ["X-Amz-Algorithm",    "AWS4-HMAC-SHA256"],
  ["X-Amz-Credential",   credential],
  ["X-Amz-Date",         dateTime],
  ["X-Amz-Expires",      expiry],
  ["X-Amz-SignedHeaders", signedHeaders],
];
queryEntries.sort(([a], [b]) => a.localeCompare(b));

// URLSearchParams encodes "/" as "%2F", "+" as "%2B" — correct for AWS
const searchParams = new URLSearchParams(queryEntries);
const canonicalQueryString = searchParams.toString();

const canonicalRequest = [
  "GET",
  objectPath,
  canonicalQueryString,
  `host:${host}\n`,
  signedHeaders,
  "UNSIGNED-PAYLOAD",
].join("\n");

const hashedCanonicalRequest = crypto
  .createHash("sha256")
  .update(canonicalRequest)
  .digest("hex");

const stringToSign = [
  "AWS4-HMAC-SHA256",
  dateTime,
  credentialScope,
  hashedCanonicalRequest,
].join("\n");

const signingKey = [dateOnly, region, service, "aws4_request"].reduce(
  (prev, curr) => crypto.createHmac("sha256", prev).update(curr).digest(),
  `AWS4${secretKey}`,
);

const signature = crypto
  .createHmac("sha256", signingKey)
  .update(stringToSign)
  .digest("hex");

const url = `https://${host}${objectPath}?${canonicalQueryString}&X-Amz-Signature=${signature}`;

console.log(url);
