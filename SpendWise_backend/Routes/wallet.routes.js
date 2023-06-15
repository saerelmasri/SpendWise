const { Router } = require('express');
const {addWallet, removeWallet, displayWallets, editWallet } = require('../Controllers/wallets.controllers');
const route = Router();
const authenticateToken = require('../Middleware/authenticationJWT');

route.post('/addNewWallet',authenticateToken, addWallet);
route.delete('/removeWallet', authenticateToken, removeWallet);
route.get('/displayWallets', authenticateToken, displayWallets);
route.put('/editWallet', authenticateToken, editWallet);

module.exports = route;