const Wallets = require('../Models/wallets.model');
const jwt = require('jsonwebtoken');

//Add wallet controller
const addWallet = async(req, res) => {
    //Checking if a JWT token is being received
    const token = req.header('Authorization');
    if(!token){
        return res.status(409).json({
            status: 409,
            message: 'Unauthorized'
        });
    }

    try{
        //Decoded the userID
        const decoded = jwt.verify(token, process.env.JWT);
        const userId = decoded.id;

        //Getting request body
        const { walletName, walletDescription, walletAmount } = req.body;
        if(walletName.length > 30 || walletDescription.length > 30){
            return res.status(401).json({
                status: 401,
                message: 'Just 30 character are need, thank you'
            });
        }

        //Create an instance of wallets, storing all the incoming info and save it into the DB
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

//Edit wallet controller
const editWallet = async(req, res) => {
    //Checking if a JWT token is being received
    const token = req.header('Authorization');
    if(!token){
        return res.status(409).json({
            status: 409,
            message: 'Unauthorized'
        });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT);
        const userID = decoded.id;
        //getting info from the request body. 'fieldToChange' will be used to identify the column to be change
        const { walletID, fieldToChange, newValue } = req.body;
        const updateFields = {};

        if (fieldToChange === 'name') {
            updateFields.name = newValue;
        } else if (fieldToChange === 'description') {
            updateFields.description = newValue;
        } else {
            return;
        }

        await Wallets.findOneAndUpdate(
            { _id: walletID, userID: userID },
            { $set: updateFields }
        );

        const updatedWallet = await Wallets.findById(walletID);

        return res.status(200).json({
            status: 200,
            message: 'Wallet updated successfully',
            wallet: updatedWallet
        });

    }catch(err){
        res.status(500).json({
            status: 500,
            message: 'Something went wrong. Server Error'
        })
    }
}

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
    displayWallets,
    editWallet
 };

