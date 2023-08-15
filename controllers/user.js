const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    const name = req.body.named;
    const email = req.body.emailed;
    const password = req.body.passed;
    // console.log(name+" n "+password+" p "+email+" e ")
    try {
        const hash = await bcrypt.hash(password, 10);
        const result = User.create({ Name: name, Email: email, Password: hash });
        console.log(result.dataValues);
        res.send(result);
    }
    catch (err) {
        res.send(err);
    }
}

exports.login = async (req, res) => {
    const email = req.body.emailed;
    const password = req.body.passed;
    try {
        const result = await User.findAll({
            where: {
                Email: email,
            }
        })
        // console.log(result);
        if (result.length)      //if len>0  =>  Email FOUND
        {
            const dbHash = result[0].dataValues.Password;
            console.log(dbHash + " ==> is the Password fetched From Database.");
            const isAuthorized = await bcrypt.compare(password, dbHash);
            if (isAuthorized) {
                res.send({
                    message: 'User logged in Succesfully',
                    success: true
                });
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