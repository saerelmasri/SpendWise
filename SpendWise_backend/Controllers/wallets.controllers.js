const Wallets = require('../Models/wallets.model');
const jwt = require('jsonwebtoken');

//Add wallet
const addWallet = async(req, res) => {
    const token = req.header('Authorization');
    if(!token){
        return res.status(409).json({
            status: 409,
            message: 'Unauthorized'
        });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT);
        const userId = decoded.id;

        const { walletName, walletDescription, walletAmount } = req.body;
        if(walletName.length > 30 || walletDescription.length > 30){
            return res.status(401).json({
                status: 401,
                message: 'Just 30 character are need, thank you'
            });
        }

        const wallet = new Wallets();
        wallet.userID = userId;
        wallet.name = walletName;
        wallet.amount = walletAmount;
        wallet.description = walletDescription;
        await wallet.save();

        return res.status(201).json({
            status: 201,
            message: 'Wallet created'
        });

    }catch(err){
        console.log(err);
        res.status(500).json({
            status: 500,
            message: 'Something went wrong. Server Error'
        })
    }
}

//Edit wallet

//Remove wallet
const removeWallet = async(req, res) => {
    const token = req.header('Authorization');
    if(!token){
        return res.status(409).json({
            status: 409,
            message: 'Unauthorized'
        });
    }
    try{
        const { walletID } = req.body;
        await Wallets.findByIdAndRemove(walletID)
        .then(removedWallet => {
            if(removedWallet){
                return res.status(201).json({
                    status: 201,
                    message: 'Wallet removed successfully'
                });
            }else{
                return res.status(500).json({
                    status: 500,
                    message: 'Wallet not found'
                });
            }
        }).catch(err => {
            console.log(err);
            return res.status(500).json({
                status: 500,
                message: 'Something went wrong'
            })
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            status: 500,
            message: 'Something went wrong. Server Error'
        });
    }
}

//Display all wallets with info
const displayWallets = async (req, res) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(409).json({
            status: 409,
            message: 'Unauthorized'
        });
    }
  
    try {
        const decoded = jwt.verify(token, process.env.JWT);
        const userId = decoded.id;

        const wallets = await Wallets.find({ userID: userId });

        if(!wallets){
            return res.status('401').json({
                status: 401,
                message: 'No wallets found'
            });
        }else{
            return res.status(200).json({
                status: 200,
                message: 'Successful',
                wallets: wallets
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: 500,
            message: 'Something went wrong. Server Error'
        });
    }
};
  


module.exports = { 
    addWallet, 
    removeWallet,
    displayWallets
 };

