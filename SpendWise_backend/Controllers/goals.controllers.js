const Goal = require('../Models/goals.model');
const jwt = require('jsonwebtoken');

//Create a new goal
const newGoal = async(req, res) => {
    try{
        //User id from decoded JWT
        const userId = req.user.id;
        
        const { name, amount, category } = req.body;
        const createGoal = new Goal();
        createGoal.userID = userId;
        createGoal.goalName = name;
        createGoal.goalAmount = amount;
        createGoal.goalCategory = category;
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

//Display all goals based on the current month and calculate how much per month do the user has to save to reach the goal


//Pay the goal

//Display all transaction for a goal

module.exports = newGoal;