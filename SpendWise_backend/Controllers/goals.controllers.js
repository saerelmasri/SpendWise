const Category = require('../Models/category.model');
const Goal = require('../Models/goals.model');
const jwt = require('jsonwebtoken');
const Wallets = require('../Models/wallets.model');
const Transaction = require('../Models/transaction.model');

const calculateGoal = (goalAmount, goalDeadline) => {
    return goalAmount / goalDeadline;
}

//Create a new goal
const newGoal = async(req, res) => {
    try{
        //User id from decoded JWT
        const userId = req.user.id;

        const { name, amount, category, days } = req.body;
        const createGoal = new Goal();
        createGoal.userID = userId;
        createGoal.goalName = name;
        createGoal.goalAmount = amount;
        createGoal.goalCategory = category;
        createGoal.goalDeadline = days;
        createGoal.paymentPerMonth = calculateGoal(amount, days);
        await createGoal.save();

        return res.status(201).json({
            status: 201,
            message: 'Goal created successfully'
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            status: 500,
            message: 'Server error'
        })
    }
}

//Display all goals based on the current month and payment per day
const displayGoals = async(req, res) => {
    try{
        const userId = req.user.id;

        await Goal.find({userID: userId},{ _id: 0, userID: 0, __v: 0, goalDeadline: 0 })
        .then( async goal =>{
            if(!goal){
                return res.status(500).json({
                    status: 500,
                    message: 'No goal found'
                });
            }

            const category = goal[0].goalCategory;
            
            await Category.find(category).then(goalCatg => {
                const icon = goalCatg[0].icon;
                return res.status(201).json({
                    status: 201,
                    message: 'Success',
                    goals: goal,
                    categoryIcon: icon
                });  
            })
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            status: 500,
            message: 'Server error'
        });
    }
}


//Pay the goal
const payGoal = async(req, res) => {
    try{
        const { goalId, walletId } = req.body;
        const userId = req.user.id;

        const goalInfo = await Goal.findOne({_id: goalId, userID: userId});

        const info = {
            payment: parseFloat(goalInfo.paymentPerMonth.toFixed(2), 10),
            name: goalInfo.goalName,
            amount: goalInfo.goalAmount,
            progress: goalInfo.goalProgress,
        };
        
        if(info.progress === info.amount){
            return res.status(201).json({
                status: 201,
                message: 'Goal paid',
                key: 'Paid'
            })
        }
        
        //Getting the wallet amount
        const walletInfo = await Wallets.findOne({_id: walletId, userID: userId});
        const walletAmount = walletInfo.amount;
        
        //Checking if wallet amount is greater that the daily payment
        if(walletAmount < info.payment){
            return res.status(401).json({
                status: 401,
                message: 'Not enough credits to pay'
            })
        }

        //Substract the daily payment from the wallet
        const payment = walletAmount - info.payment
        const updateProgress = info.progress + info.payment;
        //Updating the wallet amount after substracting the goal payment
        const updateWallet = await Wallets.findOneAndUpdate(
            {_id: walletId, userID: userId},
            {$set: { amount: payment }}
        ).exec();

        if(!updateWallet){
            return res.status(401).json({
                status: 401,
                message: 'Wallet not found'
            }); 
        }

        const transaction = await Goal.findOneAndUpdate(
            { _id: goalId, userID: userId },
            { $set: { goalProgress: updateProgress } }
        ).exec();

        if(!transaction){
            return res.status(401).json({
                status: 401,
                message: 'No goal found to pay',
            });
        }

        const goalLog = new Transaction();
        goalLog.goalID = goalId;
        goalLog.userID = userId;
        goalLog.amount = info.payment;
        await goalLog.save();
        
        return res.status(201).json({
            status: 201,
            message: 'Transaction logged'
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            status: 500,
            message: 'Server error'
        });
    }
}

//Display all transaction for a goal
const displayTransactions = async(req, res) => {
    try{
        const userId = req.user.id;
        const { goalId } = req.body;
        const transactions = await Transaction.find({goalID: goalId, userID: userId});
        return res.status(201).json({
            status: 201,
            message: 'Success',
            logs: transactions
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({
            status: 500,
            message: 'Server error'
        });
    }
}

module.exports = {
    newGoal,
    displayGoals,
    payGoal,
    displayTransactions
};