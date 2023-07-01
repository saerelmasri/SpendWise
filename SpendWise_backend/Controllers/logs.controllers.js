const jwt = require('jsonwebtoken');
const Category = require('../Models/category.model');
const Log = require('../Models/logs.model');
const Wallet = require('../Models/wallets.model');

//Add log (expense or income)
const addLog = async(req, res) => {
    try{
        const userId = req.user.id;
        const { category, wallet, logAmount, logDescription } = req.body;

        const logType = await Category.findOne({_id: category});

        //If category is incomes it will increase the amount of the wallet
        if(logType.type === 'Incomes'){
            //Find user's wallet and add the amount of the log
            await Wallet.findOneAndUpdate(
                {_id: wallet, userID: userId},
                {$inc: { amount: logAmount}}, 
                {new:true}
            );

            //Create a new log
            const log = new Log();
            log.categoryID = category;
            log.walletID = wallet;
            log.userID = userId;
            log.logAmount = logAmount;
            log.logDescription = logDescription;
            await log.save();

            return res.status(201).json({
                status: 201,
                message: 'New log added'
            });
        }else if(logType.type === 'Expenses'){
            await Wallet.findOneAndUpdate(
                {_id: wallet, userID: userId},
                {$inc: { amount: -logAmount} },
                { new: true }
            );
            const log = new Log();
            log.categoryID = category;
            log.walletID = wallet;
            log.userID = userId;
            log.logAmount = logAmount;
            log.logDescription = logDescription;
            await log.save();

            return res.status(201).json({
                status: 201,
                message: 'New log added'
            });
        }
    }catch(err){
        console.log(err);
        throw err;
    }
}

//Display logs of a month of a particular wallet
const monthyExpense = async(req, res) => {
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

        

    }catch(err){
        console.log(err);
        throw err;
    }
}

//Edit a log

//Remove a log (After removing this particular log, the amount is return to the wallet)
const deleteLog = async (req, res) => {
    try {
        const userId = req.user.id;
        const { transactionID } = req.body;
    
        const log = await Log.findOne({ _id: transactionID, userID: userId });
  
        if (!log) {
            return res.status(404).json({
            status: 404,
            message: 'Log not found'
            });
        }
  
        let logAmount, walletID, categoryID;
        if (log) {
            logAmount = log.logAmount;
            walletID = log.walletID;
            categoryID = log.categoryID;
        }
  
        const category = await Category.findOne({ _id: categoryID });
        if (category && category.type === 'Expenses') {
            const removeLog = await Log.deleteOne({ _id: transactionID });
            if (!removeLog) {
            return res.status(500).json({
                status: 500,
                message: 'Error deleting log'
            });
            }
    
            const returnFunds = await Wallet.findOneAndUpdate(
            { _id: walletID },
            { $inc: { amount: logAmount } },
            { new: true }
            );
            if (!returnFunds) {
            return res.status(500).json({
                status: 500,
                message: 'Error updating wallet'
            });
            }
    
            return res.status(201).json({
                status: 201,
                message: 'Log deleted'
            });
        } else {
            return res.status(400).json({
                status: 400,
                message: 'Log does not belong to expenses category'
            });
        }
    } catch (err) {
        console.log(err);
        throw err;
    }
};
  


module.exports = {
    addLog, 
    monthyExpense,
    deleteLog
};