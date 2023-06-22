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

//Display transactions of a loan


module.exports = {
    newLoan,
    displayLoans
};