import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter((user) => user["name"] === name && user["job"] === job);
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const generateId = () => {
  let id;

  do {
    id = Math.random().toString(36).slice(2, 8);
  } while (findUserById(id));

  return id;
};

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const addUser = (user) => {
  const newUser = { ...user, id: generateId() };
  users["users_list"].push(newUser);
  return newUser;
};

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  const newUser = addUser(userToAdd);
  res.status(201).send(newUser);
});

app.delete("/users/:id", (req, res) => {
  const userIndex = users["users_list"].findIndex(
    (user) => user["id"] === req.params.id,
  );

  if (userIndex === -1) {
    res.status(404).send("Resource not found.");
    return;
  }

  users["users_list"].splice(userIndex, 1);
  res.status(204).send();
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.name;
  if (name != undefined) {
    let result = job ? findUserByName(name, job) : findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
