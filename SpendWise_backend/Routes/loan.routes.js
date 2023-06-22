const { Router } = require('express');
const route = Router();
const authenticateToken = require('../Middleware/authenticationJWT');
const { newLoan, displayLoans, payLoan } = require('../Controllers/loan.controllers');

route.post('/newLoan', authenticateToken, newLoan);
route.get('/allLoans', displayLoans);
route.post('/payLoan', payLoan);

module.exports = route;