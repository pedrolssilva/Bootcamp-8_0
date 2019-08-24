const express = require("express");

const server = express();
server.use(express.json());

const projects = [];
let counter = 0;

server.use((req, res, next) => {
  counter++;
  console.log(`Were made ${counter} request(s) until now to API`);
  return next();
});

function projectExists(req, res, next) {
  const { id } = req.params;
  project = projects.find(p => p.id == id);
  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  req.project = project;
  console.log(req.project);
  return next();
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push({
    id,
    title,
    tasks: []
  });
  res.json(projects);
});

server.get("/projects", (req, res) => {
  res.json(projects);
});

server.put("/projects/:id", projectExists, (req, res) => {
  //const { id } = req.params;
  const { title } = req.body;

  project = req.project;
  project.title = title;
  res.json(project);
});

server.post("/projects/:id/tasks", projectExists, (req, res) => {
  //const { id } = req.params;
  const { title } = req.body;

  project = req.project;
  project.tasks.push(title);
  res.json(project);
});

server.delete("/projects/:id", projectExists, (req, res) => {
  projects.splice(req.project, 1);
  res.send();
});

server.listen(3000);
