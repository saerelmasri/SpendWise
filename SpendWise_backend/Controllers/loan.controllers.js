const jwt = require('jsonwebtoken');
const Category = require('../Models/category.model');
const Wallets = require('../Models/wallets.model');
const Transaction = require('../Models/transaction.model');
const Loan = require('../Models/loan.model');

//Montlhy payment calculation
const calculateMonthlyPayment = (principal, interestRate, loanTerm) => {
    const monthlyInterestRate = interestRate / 12;
    const numberOfPayments = loanTerm * 12;
    const numerator = principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
    const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
    const monthlyPayment = numerator / denominator;
    return monthlyPayment.toFixed(2);
}

//Create loan
const newLoan = async(req, res) => {
    try{
        const userId = req.user.id;
        const { name, amount, interest, loanYears } = req.body;

        const decimalRepresentation = interest / 100;
        const montlyPayment = calculateMonthlyPayment(amount, decimalRepresentation, loanYears);

        const createLoan = new Loan();
        createLoan.userID = userId;
        createLoan.loanName = name;
        createLoan.loanAmount = amount;
        createLoan.loanInterestRate = decimalRepresentation;
        createLoan.loanTermInYears = loanYears;
        createLoan.loanMonthyPay = montlyPayment;
        createLoan.loanProgress = 0;
        await createLoan.save();

        return res.status(201).json({
            status: 201,
            message: 'Loan created'
        })
    }catch(err){
        console.log(err);
        throw err;
    }
}

//Display loans
const displayLoans = async(req, res) => {
    try{
        const userId = req.user.id;

        const allLoans = await Loan.find({userID: userId});
        return res.status(201).json({
            status: 201,
            message: 'Success',
            loans: allLoans
        });
    }catch(err){
        console.log(err);
        throw err;
    }
}

//Pay loan
const payLoan = async(req, res) => {
    try{
        const userId = req.user.id;
        const { loanId, walletId } = req.body;

        const loanInfo = await Loan.findOne({_id: loanId, userID: userId});
        console.log(loanInfo);
        const info = {
            monthlyPay: loanInfo.loanMonthyPay,
            loanName: loanInfo.loanName,
            loanAmount: loanInfo.loanAmount,
            progress: loanInfo.loanProgress
        }

        if(info.progress === info.loanAmount){
            return res.status(201).json({
                status: 201,
                message: 'Loan paid',
                key: 'Paid'
            });
        }

        //Getting wallet amount
        const walletInfo = await Wallets.findOne({_id: walletId, userID: userId});
        const walletAmount = walletInfo.amount;

        //Checking if wallet amount is greater than the monthly payment
        if(walletAmount < info.monthlyPay){
            return res.status(401).json({
                status: 401,
                message: 'Not enough credits to pay'
            });
        }

        //Substracting the monthly payment from the wallet
        const payment = walletAmount - info.monthlyPay;
        const updateProgress = info.progress + info.monthlyPay;

        //Updating the wallet amount after substracting the monthly payment
        const updateWallet = await Wallets.findOneAndUpdate(
            {_id: walletId, userID: userId},
            {$set: {amount: payment}}
        ).exec();
        if(!updateWallet){
            return res.status(401).json({
                status: 401,
                message: 'Wallet not found'
            }); 
        }

        const transaction = await Loan.findOneAndUpdate(
            {_id: loanId, userID: userId},
            {$set:{loanProgress: updateProgress}}
        ).exec();
        if(!transaction){
            return res.status(401).json({
                status: 401,
                message: 'No goal found to pay',
            });
        }

        const loanLog = new Transaction();
        loanLog.loanID = loanId;
        loanLog.userID = userId;
        loanLog.amount = info.monthlyPay;
        await loanLog.save();

        return res.status(201).json({
            status: 201,
            message: 'Transaction looged'
        });
    }catch(err){
        console.log(err);
        throw err;
    }
}

//Display transactions of a loan
const displayTransactions = async(req, res) => {
    const token = req.header('Authorization');
    if(!token){
        return res.status(201).json({
            status: 201,
            message: 'Unauthorized'
        })
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT);
        const userId = decoded.id;
        const { loanId } = req.body;
        const allTransaction = await Transaction.find({loanID: loanId, userID: userId});
        
        return res.status(201).json({
            status: 201,
            message: 'Success',
            transactions: allTransaction
        });
        
    }catch(err){
        console.log(err);
        throw err;
    }
}



module.exports = {
    newLoan,
    displayLoans,
    payLoan,
    displayTransactions
};