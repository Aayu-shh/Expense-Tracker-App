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
        console.log(result);
        if(result!=[])
            res.send({
                message:'User logged in Succesfully',
                success: true
        });
        else
            res.sendStatus(404);
    })
}