/*
1. "password","$2b$14$my_salt_is_very_strong" 
    => "$2b$14$mu....................85CAPQRbSUblS6MjW1tSoFmK1fVkDTO"

2. "password","$2b$10$i7UK1rp17uym2cDmYLCyuu"
    => "$2b$10$i7UK1rp17uym2cDmYLCyuuqNkuVFkChwt8j/oMefS/MPhQRpMmXRu"
        <----------salt------------->
                29 chars
*/

import bcrypt from "bcrypt";

const salt = await bcrypt.genSalt();
console.log(salt);

// const hashedPassword = await bcrypt.hash("password", 16); // 2^16 rounds
// const hashedPassword = await bcrypt.hash(
//   "password",
//   salt
// );
const hashedPassword = await bcrypt.hash("password", 16);
console.log(hashedPassword);

const comparisonResult = await bcrypt.compare("password", hashedPassword);
console.log(comparisonResult);
