const Users = require('../Models/users.model');
const OTP = require('../Models/OTP.model');
const { parsePhoneNumberFromString, isValidPhoneNumber } = require('libphonenumber-js');
const jwt = require('jsonwebtoken');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const saveOTP = async (userId, code) => {
    try {
      const storeOTP = new OTP();
      storeOTP.userID = userId;
      storeOTP.OTP = code;
      await storeOTP.save();
    } catch (err) {
      console.error(err);
      throw new Error('Failed to save OTP');
    }
  };

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

        let randCode = Math.floor(Math.random() * 90000) + 10000;

        const newUser = new Users();
        newUser.first_name = first_name;
        newUser.last_name = last_name;
        newUser.phoneNumber = phoneNumber;
        newUser.currency = currency;
        newUser.email = email;
        newUser.password = password;
        newUser.verified = "Not verified"
        await newUser.save();

        client.messages
        .create({
          body: `Your verification code is ${randCode}`,
          from: '+14302456102',
          to: phoneNumber
        })
        .then(() => {
            saveOTP(newUser._id, randCode);
            const token = jwt.sign({
                id: newUser._id,
                email: newUser.email,
            }, process.env.JWT);
            return res.status(201).json({
                status: 201,
                message: 'User created successfully',
                token: token
            });
        })
        .catch(err => {
            console.log(err);
        });
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

const verifyNumber = async(req, res) => {
    const token = req.header('Authorization');
    const { code } = req.body;
    if(!token){
        return res.status(402).json({
            status: 402,
            message: 'Unauthorized'
        });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT);
        const userId = decoded.id;

        OTP.findById(userId)
            .then(otp => {
                if(!otp){
                    return res.status(500).json({
                        status: 500,
                        message: 'No OTP found'
                    });
                }

                const OTPCode = otp.OTP;

                if(code === OTPCode){
                    return res.status(201).json({
                        status: 201,
                        message: 'verify'
                    });
                }else{
                    return res.status(400).json({
                        status: 400,
                        message: 'Invalid OTP'
                    }); 
                }
            }
        )
    }catch(err){
        res.status(500).json({
            status: 500,
            message: 'Something went wrong. Server Error'
        })
    }
}

const fetchPhone = async(req, res) => {
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

        Users.findById(userId)
            .then(user => {
                if(!user){
                    return res.status(401).json({
                        status: 401,
                        message: 'User not found'
                    });
                }

                const phoneNumber = user.phoneNumber;

                return res.status(201).json({
                    status: 201,
                    message: phoneNumber
                });
            }
        )
        
    }catch(err){
        res.status(500).json({
            status: 500,
            message: 'Something went wrong. Server error'
        })
    }
}

module.exports = {
    register,
    login,
    verifyNumber,
    fetchPhone
}