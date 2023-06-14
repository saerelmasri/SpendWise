const { Router } = require('express');
const {addWallet, removeWallet, displayWallets, editWallet } = require('../Controllers/wallets.controllers');
const route = Router();

route.post('/addNewWallet', addWallet);
route.delete('/removeWallet', removeWallet);
route.get('/displayWallets', displayWallets);
route.put('/editWallet', editWallet);

module.exports = route;