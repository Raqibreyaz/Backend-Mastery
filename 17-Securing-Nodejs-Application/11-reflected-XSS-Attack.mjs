import express from "express";

const app = express();
const port = 4000;

app.get("/", (req, res) => {
  const query = req.query.q;
  console.log(query);
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Simple Search Engine</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 2rem;
          background-color: #f4f4f4;
          color: #333;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        h1 {
          color: #0066cc;
        }
        input[type="text"] {
          padding: 0.4rem;
          font-size: 1rem;
          width: 300px;
        }
        button {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          margin-left: 0.5rem;
          background-color: #0066cc;
          color: white;
          border: none;
          cursor: pointer;
        }
        p {
          margin-top: 1rem;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <h1>Search Engine</h1>
      <form action="/" method="get">
        <input type="text" name="q" placeholder="Search..." />
        <button type="submit">Search</button>
      </form>

      ${query ? `<p>No results found for: <strong>${query}</strong></p>` : ""}
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});
