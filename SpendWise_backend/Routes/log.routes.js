const { Router } = require('express');
const route = Router();
const addLog = require('../Controllers/logs.controllers');

route.post('/newLog', addLog);

module.exports = route;