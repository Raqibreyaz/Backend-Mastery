import crypto from "node:crypto";
import jwt from "jsonwebtoken";

/*
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
  .eyJuYW1lIjoicmFxdWliIiwiaWF0IjoxNzcwNDU5NTE3fQ
  .NxvZwTLGCeI4U1zDGvkPULwTEIQ3_4A7FTNpjr4YT1g;

<algorithm>.<payload>.<signature>
  */
// const token = jwt.sign({ name: "raquib" }, "secret");
// console.log(token);

const token = jwt.sign({ name: "raquib" }, "secret", {
  algorithm: "HS256",
  expiresIn: 10,
});

console.log(jwt.verify(token, "secret"));

console.log(jwt.decode(token));

console.log(
  Buffer.from(
    "eyJuYW1lIjoicmFxdWliIiwiaWF0IjoxNzcwNDU5NTE3fQ",
    "base64url",
  ).toString("utf-8"),
);

console.log(
  crypto
    .createHmac("sha256", "secret")
    .update(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmFxdWliIiwiaWF0IjoxNzcwNDU5NTE3fQ",
    )
    .digest("base64url"),
);
