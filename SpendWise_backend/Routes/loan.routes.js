const { Router } = require('express');
const route = Router();
const authenticateToken = require('../Middleware/authenticationJWT');
const { newLoan, displayLoans, payLoan, displayTransactions } = require('../Controllers/loan.controllers');

route.post('/newLoan', authenticateToken, newLoan);
route.get('/allLoans', authenticateToken, displayLoans);
route.post('/payLoan', authenticateToken, payLoan);
route.get('/allTransactions', authenticateToken, displayTransactions);

module.exports = route;