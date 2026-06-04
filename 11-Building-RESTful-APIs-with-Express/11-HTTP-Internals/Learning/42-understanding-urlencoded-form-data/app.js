/*
    1. application/x-www-form-urlencoded (default)

        Fields separated by & (e.g., name=John&age=30)
        File data not sent, only filenames
        Use in Express: express.urlencoded({ extended: false })

    2. multipart/form-data

        Fields separated by boundaries like --WebKitFormBoundary
        File data is sent as binary along with fields
        Used for file uploads
        Handled in Express by Multer middleware

    3. text/plain

        Fields separated by new lines (\n)
        File data not sent, only filenames
        Use in Express: express.text()

    4. application/json

        Data sent as JSON string
        Use in Express: express.json()
*/

/*
1. application/x-www-form-urlencoded:
      user=Anurag+Singh&email=anurag%40gmail.com&profilePic=cinnamon-2025-02-15T202940%2B0530.webm

2. multipart/form-data:
      ------WebKitFormBoundaryBs3qCGTdwGy0Ag4R
      Content-Disposition: form-data; name="user"

      Anurag Singh
      ------WebKitFormBoundaryBs3qCGTdwGy0Ag4R
      Content-Disposition: form-data; name="email"

      anurag@gmail.com
      ------WebKitFormBoundaryBs3qCGTdwGy0Ag4R
      Content-Disposition: form-data; name="profilePic"; filename=""
      Content-Type: application/octet-stream

      <Binary Content Here>
------WebKitFormBoundaryBs3qCGTdwGy0Ag4R--

3. text/plain
      user=Anurag Singh
      email=anurag@gmail.com
      profilePic=Resume-Generator-Demo-2025-12-14_17.26.33.mkv
*/

import express from "express";

const app = express();

app.use(express.static("public"));

// when content-type text/plain
app.use(express.text());

// when content-type application/json
app.use(express.json());

// when content-type url-encoded type
// extended:false, sets prototype=null
app.use(express.urlencoded({ extended: false }));
/*
{
  user: 'Anurag Singh',
  email: 'anurag@gmail.com',
  profilePic: 'post-Demo-2025-07-27_17.29.40.mkv'
}
*/

app.post("/user", (req, res) => {
  req.on("data", (chunk) => {
    console.log(decodeURIComponent(chunk.toString()));
  });

  console.log(req.body);
  console.log(Object.getPrototypeOf(req.body));
  console.log(Object.getPrototypeOf({ name: "raquib" }));

  res.json({ message: "Got Data" });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
