const express = require('express')

const server = express();
server.use(express.json());

// middleware to count requests
server.use((req, param, next) => {
  console.count('Request Counter');
  next();
});

// middleware to check if project with referenced id exists
function checkIfProjectIdExists(req, res, next) {

  const projectId = req.params.id;

  const project = projects.find(proj => proj.id == projectId );

  if(!project)
    return res.status(400).json({error: `Project whith id ${projectId} not exists.`});

  next();
}

// projects
const projects = [];

// return all projects
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// create a project
server.post('/projects', (req, res) => {
  const {id, title} = req.body;

  if(!projects.find(proj => proj.id == id)) {
    const project = {id, title, tasks: []}
    projects.push(project);

    return res.json(project);
  }

  return res.status(400).json({error: `Project with id ${id} already exists`});
});

// create a project task
server.post('/projects/:id/tasks', checkIfProjectIdExists, (req, res) => {
  const projectId = req.params.id;

  const projectIndex = projects.findIndex(proj => proj.id == projectId);

  projects[projectIndex].tasks.push(req.body.title);
  
  return res.json(projects[projectIndex]);
});

// update a project
server.put('/projects/:id', checkIfProjectIdExists, (req, res) => {
  const projectId = req.params.id;

  const projectIndex = projects.findIndex(proj => proj.id == projectId);

  if(projectIndex != -1) {
    projects[projectIndex].title = req.body.title;
  }

  return res.json(projects[projectIndex]);
});

// delete a project
server.delete('/projects/:id',checkIfProjectIdExists, (req, res) => {
  const projectId = req.params.id;
  
  const projectIndex = projects.findIndex(proj => proj.id == projectId);

  if(projectIndex != -1)
    projects.splice(projectIndex, 1);

  return res.send();
});

// server listen
server.listen(3000, () => {
  console.log('Running on port 3000');
});