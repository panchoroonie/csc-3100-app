import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

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
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await userService.findUserById(req.params.id);
    return user === null
      ? res.status(404).send("Resource not found.")
      : res.send(user);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).send("Resource not found.");
    }
    console.error(error);
    return res.status(500).send("Unable to retrieve user.");
  }
});

app.post("/users", async (req, res) => {
  try {
    const newUser = await userService.addUser(req.body);
    return res.status(201).send(newUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).send(error.message);
    }
    console.error(error);
    return res.status(500).send("Unable to add user.");
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const removedUser = await userService.removeUser(req.params.id);
    return removedUser === null
      ? res.status(404).send("Resource not found.")
      : res.status(204).send();
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).send("Resource not found.");
    }
    console.error(error);
    return res.status(500).send("Unable to remove user.");
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await userService.getUsers(req.query.name, req.query.job);
    return res.send({ users_list: users });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Unable to retrieve users.");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
