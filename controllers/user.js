const User = require('../models/user');
const Expense = require('../models/expense');
const Path = require('../util/path');
const bcrypt = require('bcrypt');
const path = require('path');


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
        const user = await User.findAll({
            where: {
                Email: email
            }
        })
        // console.log(user);
        if (user.length)      //if len>0  =>  Email FOUND
        {
            const dbHash = user[0].Password;
            //Remove Next Line  // Note - Logins for accounts before test8 won't AUTHORIZE
            console.log(dbHash + " ==> is the Password fetched From Database.");

            const isAuthorized = await bcrypt.compare(password, dbHash);
            if (isAuthorized) {
                return res.json({ success: true, redirect: 'expensePage.html' });
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

exports.addExpense = async (req, res) => {
    //const { Amount, Description, Category } = req.body;        //Extracting properties 
    try {
        const expense = await Expense.create(req.body)
        return res.send(expense);
    }
    catch (err) {
        console.log(err);
    }
}

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll();
        //console.log(expenses)
        res.send(expenses);
    }
    catch (err) {
        console.log(err);
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        console.log(req.body);
        const response = await Expense.destroy({ where: { id: req.body.id } });
        if(response == 1){
            res.send(`Succesfully deleted expense with ID: ${req.body.id}`)
        }
        else{
            res.send('Something went Wrong! Check the Code!');
        }

    }
    catch (err) {
        console.log(err);
    }
}
