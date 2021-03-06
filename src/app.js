const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4')

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validId (request, response, next) {
  const { id } = request.params

  if(!isUuid(id)){
    return response.status(400).json({ error: 'Invalid Repositorie ID'})
  }

  return next()
}



app.use("/repositories/:id", validId)

app.get("/repositories", (request, response) => {
    return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repositorie = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repositorie)
  return response.json(repositorie)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs} = request.body

  const repositorieIndex = repositories.findIndex( repositorie => repositorie.id === id)

  if(repositorieIndex < 0){
    return response.status(400).json({error: 'Invalid Repository'})
  }

  title 
  ? repositories[repositorieIndex].title = title
  : false

  url 
  ? repositories[repositorieIndex].url = url
  : false

  techs 
  ? repositories[repositorieIndex].techs = techs
  : false

  return response.json(repositories[repositorieIndex])

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositorieIndex = repositories.findIndex( repositorie => repositorie.id === id)

  if(repositorieIndex < 0){
    return response.status(400).json({error: 'Invalid Repository'})
  }

  repositories.splice(repositorieIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositorieIndex = repositories.findIndex( repositorie => repositorie.id === id)

  console.log(repositorieIndex)

  if(repositorieIndex < 0){
    return response.status(400).json({error: 'Invalid Repository'})
  }

  repositories[repositorieIndex].likes = repositories[repositorieIndex].likes + 1
  return response.json(repositories[repositorieIndex])
});

module.exports = app;
