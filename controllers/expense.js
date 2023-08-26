const Expense = require('../models/expense');


exports.addExpense = async (req, res) => {
    const { Amount, Description, Category } = req.body;        //Extracting properties 
    try {
        const expenseObj = {
            Amount: Amount,
            Description: Description,
            Category: Category,
            userId: req.user.id
        };
        const expense = await Expense.create(expenseObj)
        return res.send(expense);
    }
    catch (err) {
        console.log(err);
    }
}

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });
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