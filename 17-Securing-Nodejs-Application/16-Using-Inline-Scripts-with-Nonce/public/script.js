const formPost = document.getElementById("postForm");

formPost.addEventListener("submit", async (e) => {
  e.preventDefault();
  const content = document.getElementById("content").value;
  if (!content.trim()) return;
  await fetch("/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  document.getElementById("content").value = "";
  loadPosts();
});

async function loadPosts() {
  const response = await fetch("/posts");
  const posts = await response.json();
  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = posts
    .map(
      (p) => `
        <div class="bg-white p-4 mb-2 rounded shadow">
          <p>${p.content}</p>
          <small class="text-gray-500">${new Date(p.createdAt).toLocaleString()}</small>
        </div>`,
    )
    .join("");
}

loadPosts();


console.log(
  "%cHold Up!",
  "font-size: 48px; font-weight: bold; color: #5865F2; text-shadow: 1px 1px 0 black;"
);

console.log(
  "%cIf someone told you to copy/paste something here you have an 11/10 chance you're being scammed.",
  "font-size: 16px; color: white;"
);

console.log(
  "%cPasting anything in here could give attackers access to your account.",
  "font-size: 20px; color: red; font-weight: bold;"
);
