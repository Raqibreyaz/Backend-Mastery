const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];

  const reader = new FileReader();
  reader.addEventListener("load", function (e) {
    const arrayBuffer = e.target.result;
    console.log(arrayBuffer);
  });

  reader.readAsArrayBuffer(file);
});
