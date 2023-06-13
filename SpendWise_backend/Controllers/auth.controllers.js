const Users = require('../Models/users.model');
const OTP = require('../Models/OTP.model');
const { parsePhoneNumberFromString, isValidPhoneNumber } = require('libphonenumber-js');
const jwt = require('jsonwebtoken');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const register = async(req, res) => {
    try{
        const { first_name, last_name, phoneNumber, currency, email, password, confirmPass } = req.body
        const checkExisitingUser = await Users.findOne({email});

        if(checkExisitingUser){
            return res.status(409).json({
                status: 409,
                message: 'User already exist'
            })
        }

        const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber);
        if(!parsedPhoneNumber && !isValidPhoneNumber){
            return res.status(409).json({
                status: 409,
                message: 'Invalid phone number'
            });
        }

        if(password !== confirmPass){
            return res.status(409).json({
                status: 409,
                message: 'Passwords must match'
            })
        }

        const newUser = new Users();
        newUser.first_name = first_name;
        newUser.last_name = last_name;
        newUser.phoneNumber = phoneNumber;
        newUser.currency = currency;
        newUser.email = email;
        newUser.password = password;
        await newUser.save();

        const token = jwt.sign({
            id: newUser._id,
            email: newUser.email,
        }, process.env.JWT);

        return res.status(201).json({
            status: 201,
            message: 'User created successfully',
            token: token
        })

    }catch(err){
        res.status(500).json({
            status: 500,
            message: 'Error'
        })
    }
}

const login = async(req, res) => {
    try{
        const { email, password } = req.body
        const checkUser = await Users.findOne({email});
        if(!checkUser){
            return res.status(401).json({
                status: 401,
                message: 'Invalid credentials'
            });
        }

        const isMatch = await checkUser.matchPassword(password);
        if(!isMatch){
            return res.status(401).json({
                status: 401,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign({
            id: checkUser._id,
            email: checkUser.email
        }, process.env.JWT);

        res.status(201).json({
            status: 201,
            message: 'Login successful',
            token: token
        })
    }catch(err){
        res.status(500).json({
            status: 500,
            message: 'Something went wrong'
        });
    }
}

const sendVerification = (req, res) => {
    const { phoneNumber } = req.body;
    let randCode = Math.floor(Math.random() * 90000) + 10000;

}

module.exports = {
    register,
    login
}