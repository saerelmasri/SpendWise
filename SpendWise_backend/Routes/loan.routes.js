const { Router } = require('express');
const route = Router();
const newLoan = require('../Controllers/loan.controllers');

route.post('/newLoan', newLoan);

module.exports = route;