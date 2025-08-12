const express = require('express');
const routeres = express();
const userController = require('../controller/user.Controller');
routeres.use(express.json());
const data = {
  users: ["alice", "bob", "charlie"] // Example user data
};
routeres.get('/', userController.getuser);
routeres.post('/users', userController.createuser);
module.exports = routeres;
