const User = require('../models/user');
const Path = require('../util/path');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const path = require('path');

function tokenGenerator(id,name){ 
    const payload = {
        userId:id,
        name:name
    }
    const token = jwt.sign(payload, 'mySecretKey');
    return(token);
}

exports.signup = async (req, res) => {
    const name = req.body.named;
    const email = req.body.emailed;
    const password = req.body.passed;
    // console.log(name+" n "+password+" p "+email+" e ")
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
        // console.log(user);
        if (users.length)      //if len>0  =>  Email FOUND
        {
            const dbHash = users[0].Password;
            //Remove Next Line  // Note - Logins for accounts before test8 won't AUTHORIZE
            console.log(dbHash + " ==> is the Password fetched From Database.");

            const isAuthorized = await bcrypt.compare(password, dbHash);
            if (isAuthorized) {
                return res.json({ success: true, redirect: 'expensePage.html', userId: users[0].id,token:tokenGenerator(users[0].id,users[0].Name) });
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


