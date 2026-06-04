import { getSignedS3Url } from "./urlSigner.js";

const signedUrl = getSignedS3Url({
  bucketName: "raquibs-bucket",
  objectKey: "my-js-resume.pdf",
  method:"GET",
  contentType:"application/pdf"
});

console.log(signedUrl);
