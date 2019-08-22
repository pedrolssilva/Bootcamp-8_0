const express = require('express');

const server = express();

/*We've three params type:
  Query params = ?teste=1
  Route params = /users/1
  Request body = {name:"Diego", email:"diego@rocketseat.com.br"} =>Usually in POST and PUT
*/

const users = ["Diego", "Cláudio", "Victor"];

server.get('/users/:index', (req, res) => {
  const nome = req.query.nome; //consuming by query params
  const { index } = req.params; //consuming by route params

  return res.json(users[index]);

});

server.listen(3000);