const User = require('../models/user');
exports.signup = (req, res, next) => {
    const name = req.body.named;
    const email = req.body.emailed;
    const password = req.body.passed;
    // console.log(name+" n "+password+" p "+email+" e ")
    User.create({ Name: name, Email: email, Password: password })
        .then(result => {
            console.log(result.dataValues);
            res.send(result)
        })
        .catch(err => res.send(err));
}

exports.login = (req, res, next) => {
    const email = req.body.emailed;
    const password = req.body.passed;
    // console.log(name+" n "+password+" p "+email+" e ")
    User.findAll({where:{
        Email: email,
        Password: password
    }})
    .then(result =>{
        //console.log(result);
        if (result.length)      //if len>0  => Correct Credentials FOUND
            res.send({
                message:'User logged in Succesfully',
                success: true
        });
        else
            User.findAll({where:{
                Email:email
            }})
            .then(elseResult =>{
                if(elseResult.length)       //if len>0 => Email FOUND but Password didn't match (from outer IF)
                    res.status(401).send('User NOT Authorized !')
                else
                    res.status(404).send('User NOT Found !')
            })
    })
    .catch(err=>console.log(err));
}