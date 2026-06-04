const buttons = document.querySelectorAll("button");

buttons.forEach((button) => {
  button.addEventListener("click", async () => {
    const id = button.dataset.id;
    const response = await fetch(`http://localhost:4000/todos/${id}`, {
      method: "DELETE",
    });
    await response.json();
    window.location.reload();
  });
});
