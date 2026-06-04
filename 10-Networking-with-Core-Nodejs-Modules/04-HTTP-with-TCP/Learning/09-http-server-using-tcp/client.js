(async () => {
  const res = await fetch("http://localhost:4000");

  res.headers.forEach((value, key) => {
    console.log(key, value);
  });

  // included \r\n into it! in any case...
  // const text = await res.text();
  // console.log(text.length, text);

  const decoder = new TextDecoder();
  for await (const chunk of res.body) {
    const decoded_chunk = decoder.decode(chunk);
    document.write(decoded_chunk);
  }
})();
