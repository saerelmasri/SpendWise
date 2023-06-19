const { Router } = require('express');
const route = Router();
const authenticateToken = require('../Middleware/authenticationJWT');
const {newGoal, displayGoals, payGoal, displayTransactions} = require('../Controllers/goals.controllers');

route.post('/newGoal', authenticateToken, newGoal);
route.get('/goalById', authenticateToken, displayGoals);
route.get('/transactions', authenticateToken, displayTransactions);
route.post('/paymentGoal', authenticateToken, payGoal);

module.exports = route;
