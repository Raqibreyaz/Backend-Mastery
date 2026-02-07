import crypto from "node:crypto";

async function promisifiedPbkdf2(
  password,
  hashLen = 32,
  algo = "sha256",
  salt = "salt",
) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 3 * 1e5, hashLen, algo, (err, hash) => {
      if (err) return reject(err);
      resolve(hash.toString("hex"));
    });
  });
}

async function hashPassword(password, passWordLen = 32, algo = "sha256") {
  const salt = crypto.randomBytes(16);
  return {
    salt: salt.toString("hex"),
    hash: await promisifiedPbkdf2(password, hashLen, algo, salt),
  };
}

async function verifyPassword(receivedPassword, hashedPassword, salt) {
  console.log("received pass", receivedPassword);
  console.log("stored pass hash", hashedPassword);
  console.log("stored salt", salt);

  const hash = await promisifiedPbkdf2(receivedPassword, 32, "sha256", salt);

  console.log("generated hash", hash);

  return hash === hashedPassword;
}

const res = await promisifiedPbkdf2('12345',32,'sha256','da2ee978f5585005535d2669ff005028')

console.log(res);
