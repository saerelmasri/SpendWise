const { Router } = require('express');
const route = Router();
const { login, register, verifyNumber, fetchPhone } = require('../Controllers/auth.controllers');

route.post('/register', register);
route.get('/login', login);
route.post('/verifyOTP', verifyNumber);
route.get('/fetchPhone', fetchPhone);

module.exports = route;