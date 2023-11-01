const jwt = require('jsonwebtoken');
const User = require('../models/user');
exports.authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ 'success': false, message: 'Authorization token missing' })
        }
        const userObj = jwt.verify(token, process.env.TOKEN_SECRET);        //decrypt
        const myUser = await User.findByPk(userObj.userId);
        if (!myUser) {
            res.status(404).json({ 'success': false, message: 'User Not found' })
        }
        req.user = myUser;
        next();
    }
    catch (err) {
        return res.status(500).json({ 'success': false, message: 'Internal Server Error' });
    }

}