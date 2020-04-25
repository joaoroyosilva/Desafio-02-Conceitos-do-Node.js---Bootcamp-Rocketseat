const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

function checkId(request, response, next) {
  const { id } = request.params;

  let repository = repositories.find((rep) => rep.id == id);

  if (!repository && id)
    return response.status(400).json({ error: "Repository not find" });

  next();
}

app.get("/repositories", (request, response) => {
  response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;
  const repository = { id: uuid(), url, title, techs, likes: 0 };
  repositories.push(repository);
  return response.status(200).json(repository);
});

app.put("/repositories/:id", checkId, (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;
  let repository = null;
  repositories = repositories.map((r) => {
    if (r.id === id) {
      r = { ...r, url, title, techs };
      repository = r;
    }
    return r;
  });
  return response.status(200).json(repository);
});

app.delete("/repositories/:id", checkId, (request, response) => {
  const { id } = request.params;
  let index = repositories.findIndex((rep) => rep.id == id);
  repositories.splice(index, 1);
  return response.status(204).json({ message: "Repository deleted" });
});

app.post("/repositories/:id/like", checkId, (request, response) => {
  const { id } = request.params;
  let repository = null;
  repositories = repositories.map((r) => {
    if (r.id === id) {
      r.likes += 1;
      repository = r;
    }
    return r;
  });
  return response.status(200).json(repository);
});

module.exports = app;
