if (window.name === "login-popup") {
  const code = new URLSearchParams(location.search).get("code");
  if (code) {
    window.opener.postMessage({ code });
    window.close();
  }
}
