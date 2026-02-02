import React from "react";

export default function Layout({ children, title }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="stylesheet" href="style.css" />
        <script src="script.js" defer></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
