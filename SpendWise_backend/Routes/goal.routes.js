const { Router } = require('express');
const route = Router();
const authenticateToken = require('../Middleware/authenticationJWT');
const {newGoal, displayGoals} = require('../Controllers/goals.controllers');

route.post('/newGoal', authenticateToken, newGoal);
route.get('/goalById', authenticateToken, displayGoals)

module.exports = route;
