const { Router } = require('express');
const route = Router();
const authenticateToken = require('../Middleware/authenticationJWT');
const { newLoan, displayLoans } = require('../Controllers/loan.controllers');

route.post('/newLoan', authenticateToken, newLoan);
route.get('/allLoans', displayLoans);

module.exports = route;