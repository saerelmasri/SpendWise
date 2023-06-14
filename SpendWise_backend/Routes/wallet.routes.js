const { Router } = require('express');
const addWallet = require('../Controllers/wallets.controllers');
const route = Router();

route.post('/addNewWallet', addWallet);

module.exports = route;