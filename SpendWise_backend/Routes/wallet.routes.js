const { Router } = require('express');
const {addWallet, removeWallet, displayWallets } = require('../Controllers/wallets.controllers');
const route = Router();

route.post('/addNewWallet', addWallet);
route.delete('/removeWallet', removeWallet);
route.get('/displayWallets', displayWallets);

module.exports = route;