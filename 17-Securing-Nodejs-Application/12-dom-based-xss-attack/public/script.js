function showGreetingFromHash() {
  const name = decodeURIComponent(location.hash.slice(1));
  document.getElementById("output").innerHTML = `Hello, ${name}!`;
}

window.addEventListener("hashchange", showGreetingFromHash);
window.addEventListener("DOMContentLoaded", showGreetingFromHash);
