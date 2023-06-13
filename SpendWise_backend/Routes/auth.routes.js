const { Router } = require('express');
const route = Router();
const { login, register } = require('../Controllers/auth.controllers');

route.post('/register', register);
route.get('/login', login);

module.exports = route;