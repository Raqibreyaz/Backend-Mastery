import crypto from "crypto";

// Replace with your credentials
const accessKeyId = "<access-key>";
const secretAccessKey = "<secret-key>";
const region = "ap-south-1";

export function getSignedS3Url({
  bucketName,
  objectKey,
  method = "GET",
  expiresInSeconds = 3600,
  contentType = null,
}) {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);

  const service = "s3";
  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;

  const host = `${bucketName}.s3.${region}.amazonaws.com`;
  const canonicalUri = `/${objectKey}`;

  const signedHeaders = contentType ? "content-type;host" : "host";
  let canonicalHeaders = `host:${host}\n`;
  if (contentType) {
    canonicalHeaders = `content-type:${contentType}\n` + canonicalHeaders;
  }

  const queryParams = {
    "X-Amz-Algorithm": algorithm,
    "X-Amz-Credential": `${accessKeyId}/${credentialScope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": expiresInSeconds,
    "X-Amz-SignedHeaders": signedHeaders,
  };

  const canonicalQueryString = Object.entries(queryParams)
    .map(
      ([paramName, paramValue]) =>
        `${encodeURIComponent(paramName)}=${encodeURIComponent(paramValue)}`
    )
    .sort()
    .join("&");

  const payloadHash = "UNSIGNED-PAYLOAD";

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const hashedCanonicalRequest = crypto
    .createHash("sha256")
    .update(canonicalRequest)
    .digest("hex");

  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    hashedCanonicalRequest,
  ].join("\n");

  const hmac = (key, data) =>
    crypto.createHmac("sha256", key).update(data).digest();

  const dateKey = hmac("AWS4" + secretAccessKey, dateStamp);
  const regionKey = hmac(dateKey, region);
  const serviceKey = hmac(regionKey, service);
  const signingKey = hmac(serviceKey, "aws4_request");

  const signature = crypto
    .createHmac("sha256", signingKey)
    .update(stringToSign)
    .digest("hex");

  const signedUrl = `https://${host}${canonicalUri}?${canonicalQueryString}&X-Amz-Signature=${signature}`;
  return signedUrl;
}
