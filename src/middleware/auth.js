const jwt = require('jsonwebtoken');
const User = require('../model/user.js');

const auth = async (req, res, next)=>{
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisiskey')
        const user = await User.findOne({_id:decoded._id, 'tokens.token':token})
    
        if(!user){
            throw new Error('User沒有登入')
        }
        //可以傳給router那邊，不用再次尋找該user
        req.user = user;
        req.token = token;
        next()
    
    } catch (error) {
        console.log(error);
        res.status(401).send(error)
    }
}

module.exports = auth