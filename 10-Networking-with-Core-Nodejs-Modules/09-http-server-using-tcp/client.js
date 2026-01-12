(async () => {
  const res = await fetch("http://localhost:4000");

  res.headers.forEach((value, key) => {
    console.log(key, value);
  });

  for await (const chunk of res.body) {
    console.log(chunk);
  }
})();
