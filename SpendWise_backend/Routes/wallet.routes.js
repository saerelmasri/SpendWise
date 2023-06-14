const { Router } = require('express');
const {addWallet, removeWallet } = require('../Controllers/wallets.controllers');
const route = Router();

route.post('/addNewWallet', addWallet);
route.delete('/removeWallet', removeWallet)

module.exports = route;