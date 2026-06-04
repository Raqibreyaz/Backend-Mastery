// Node.js equivalents of Redis Search commands
import { createClient } from "redis";

const client = createClient();
await client.connect();

// 🔎 Fuzzy Search (Approximate Matching)
await client.ft.search("userIdx", "%Kumar%");

// 🌠 Search by Any Word (Logical OR)
await client.ft.search("userIdx", "Bhupesh|Sahil");

// 📃 Paging Results (Pagination)
await client.ft.search("userIdx", "Delhi", {
  LIMIT: {
    from: 10,
    size: 5,
  },
});

// 🚫 Excluding Words from Search
await client.ft.search("userIdx", "-Sanat");

// 🔠 Partial Word Search
// Prefix Match
await client.ft.search("userIdx", "Kum*");

// Suffix Match
await client.ft.search("userIdx", "*mar");

// Specific Suffix Match
await client.ft.search("userIdx", "*maar");

// Disconnect when done
await client.quit();
