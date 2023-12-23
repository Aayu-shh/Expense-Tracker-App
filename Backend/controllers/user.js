const User = require('../models/user');
const Path = require('../util/path');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

function tokenGenerator(id,name,premium){ 
    const payload = {
        userId:id,
        name:name,
        isPremium:premium
    }
    const token = jwt.sign(payload, process.env.TOKEN_SECRET);
    return(token);
}

exports.signup = async (req, res) => {
    const name = req.body.named;
    const email = req.body.emailed;
    const password = req.body.passed;
    try {
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ Name: name, Email: email, Password: hash });
        res.send(user);
    }
    catch (err) {
        res.send(err);
    }
}

exports.login = async (req, res) => {
    const email = req.body.emailed;
    const password = req.body.passed;
    try {
        const users = await User.findAll({
            where: {
                Email: email
            }
        })

        if (users.length)      //if len>0  =>  Email FOUND
        {
            const dbHash = users[0].Password;
            const isAuthorized = await bcrypt.compare(password, dbHash);
            if (isAuthorized) {
                return res.json({ success: true, redirect: 'expensePage.html', token: tokenGenerator(users[0].id, users[0].Name, users[0].isPremiumUser), premium: users[0].isPremiumUser });
            }
            else {
                res.status(401).send('Wrong password entered, User NOT Authorized !');
            }
        }
        else {
            res.status(404).send('User NOT Found in Database!')
        }
    }
    catch (err) {
        console.log(err);
    }
}


