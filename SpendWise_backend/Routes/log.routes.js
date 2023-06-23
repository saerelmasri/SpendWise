const { Router } = require('express');
const route = Router();
const addLog = require('../Controllers/logs.controllers');
const authenticateToken = require('../Middleware/authenticationJWT');

route.post('/newLog', authenticateToken, addLog);

module.exports = route;