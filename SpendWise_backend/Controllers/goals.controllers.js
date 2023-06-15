const Category = require('../Models/category.model');
const Goal = require('../Models/goals.model');
const jwt = require('jsonwebtoken');

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

//Display all transaction for a goal

module.exports = {
    newGoal,
    displayGoals
};