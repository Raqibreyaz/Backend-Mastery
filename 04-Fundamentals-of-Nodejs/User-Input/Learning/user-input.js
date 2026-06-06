import readLine from "readline";

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("what is your name? ", function (name) {
  console.log(`my name is ${name}`);
  rl.close();
});

function userInput(ask) {
  process.stdout.write(ask);

  return new Promise((resolve) => {
    process.stdin.on("data", (data) => {
      resolve(data.toString().trim());
      process.stdin.pause();
    });
  });
}

const name = await userInput("Enter your name: ");
console.log(name);