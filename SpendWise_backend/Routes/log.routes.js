const { Router } = require('express');
const route = Router();
const {addLog, monthyExpense, deleteLog} = require('../Controllers/logs.controllers');
const authenticateToken = require('../Middleware/authenticationJWT');

route.post('/newLog', authenticateToken, addLog);
route.get('/monthyLogs', monthyExpense);
route.delete('/removeLog', authenticateToken, deleteLog);

module.exports = route;