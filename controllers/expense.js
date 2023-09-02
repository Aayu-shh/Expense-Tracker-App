const Expense = require('../models/expense');
const User = require('../models/user');


exports.addExpense = async (req, res) => {
    const { Amount, Description, Category } = req.body;        //Extracting properties 
    try {
        const expenseObj = {
            Amount: Amount,
            Description: Description,
            Category: Category,
        };
        //using Sequelize Magic Function createExpense()
        const expense = await req.user.createExpense(expenseObj);
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

//FIX send USER names list and corresponding expenses //// list of objcts with UserName and Total expense!!
exports.getLdrbrdData = async (req, res) => {
    try {
        var list = [];
        var list1 = [];
        const users = await User.findAll();
        for(let i=0;i<users.length;i++){
            const expenses = await Expense.findAll({ where: { userId: users[i].id } })
            let amt = 0;
            expenses.forEach(exp => {
                amt +=  parseInt(exp.Amount);
            })
            list[i] = users[i].Name;
            list1[i] = amt;
         };

         console.log(list1);
         return res.status(200).json({'userNames':list,'userExpenses':list1});           
    }
    catch (err) {
        throw new Error(JSON.stringify(err));
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