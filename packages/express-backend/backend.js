import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);

if (!MONGO_CONNECTION_STRING) {
  throw new Error("MONGO_CONNECTION_STRING is not defined in .env");
}

const mongoUri = new URL(MONGO_CONNECTION_STRING);
mongoUri.pathname = "/users";

mongoose.connect(mongoUri.toString()).catch((error) => {
  console.error("Unable to connect to MongoDB:", error);
});

const port = 8000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
