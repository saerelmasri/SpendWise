const { Router } = require('express');
const route = Router();
const { login, register, verifyNumber, fetchPhone, sendNewOTP } = require('../Controllers/auth.controllers');
const authenticateToken = require('../Middleware/authenticationJWT');

route.post('/register', register);
route.get('/login', login);
route.post('/verifyOTP', authenticateToken, verifyNumber);
route.get('/fetchPhone', authenticateToken, fetchPhone);
route.get('/newOTP', authenticateToken, sendNewOTP);

module.exports = route;