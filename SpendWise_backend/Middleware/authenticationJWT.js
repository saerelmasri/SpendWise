const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) =>{
    const token = req.header('Authorization');
    if(!token){
        return res.status(409).json({
            status: 409,
            message: 'Unauthorize'
        });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT);
        req.user = decoded;
        next();
    }catch(error){
        res.status(500).json({
            status: 500,
            message: 'Server error'
        })
    }
}

module.exports = authenticateToken;