import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb://admin:admin@localhost:27017/todoApp?authSource=admin",
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await mongoose.disconnect()
  console.log("Client Disconnected!");
  process.exit(0);
});
