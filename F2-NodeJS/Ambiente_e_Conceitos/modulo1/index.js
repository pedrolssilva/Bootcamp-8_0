const express = require("express");

const server = express();

server.use(express.json());

/*We've three params type:
  Query params = ?teste=1
  Route params = /users/1
  Request body = {name:"Diego", email:"diego@rocketseat.com.br"} =>Usually in POST and PUT
*/

const users = ["Diego", "Robson", "Victor"];

server.use((req, res, next) => {
  console.log(`Método ${req.method} URL: ${req.url}`);
  console.time("Request");
  next();

  console.timeEnd("Request");
});

function checkUsersExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }
  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User doesn't exists" });
  }

  req.user = user;

  return next();
}

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(req.user);
});

server.post("/users", checkUsersExists, (req, res) => {
  const { name } = req.body;
  users.push(name);
  return res.json(users);
});

server.put("/users/:index", checkUserInArray, checkUsersExists, (req, res) => {
  const { index } = req.params; //consuming by route params
  const { name } = req.body;

  users[index] = name;
  return res.json(users);
});

server.delete("/users/:index", (req, res) => {
  const { index } = req.params; //consuming by route params

  users.splice(index, 1);
  return res.send();
});

server.listen(3000);
