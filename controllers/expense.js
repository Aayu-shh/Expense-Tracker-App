const Expense = require('../models/expense');


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
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });
        //console.log(expenses)
        res.send(expenses);
    }
    catch (err) {
        console.log(err);
    }
}

exports.deleteExpense = async (req, res) => {
    try {
        console.log(req.user);
        const response = await Expense.destroy({ where: { id: req.body.id } });
        if (response == 1) {
            res.send(`Succesfully deleted expense with ID: ${req.body.id}`)
        }
        else {
            res.send('Something went Wrong! Check the Code!');
        }

    }
    catch (err) {
        console.log(err);
    }
}