const { Router } = require('express');
const route = Router();
const authenticateToken = require('../Middleware/authenticationJWT');
const newGoal = require('../Controllers/goals.controllers');

route.post('/newGoal', authenticateToken, newGoal);

module.exports = route;
