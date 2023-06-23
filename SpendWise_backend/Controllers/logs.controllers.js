const jwt = require('jsonwebtoken');
const Category = require('../Models/category.model');
const Log = require('../Models/logs.model');
const Wallet = require('../Models/wallets.model');

//Add log (expense or income)
const addLog = async(req, res) => {
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

        const { category, wallet, logAmount, logDescription } = req.body;

        const logType = await Category.findOne({_id: category});
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
            console.log('Decrease wallet');
        }

    }catch(err){
        console.log(err);
        throw err;
    }
}

//Display logs of a month of a particular wallet

//Edit a log

//Remove a log (After removing this particular log, the amount is return to the wallet)


module.exports = addLog;