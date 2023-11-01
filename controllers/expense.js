const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');
const UserServices = require('../services/userservices');

exports.addExpense = async (req, res) => {
    const t = await sequelize.transaction();
    const { Amount, Description, Category } = req.body;        //Extracting properties 
    try {
        const expenseObj = {
            Amount: Amount,
            Description: Description,
            Category: Category,
        };
        //using Sequelize Magic Function createExpense()
        const expense = await req.user.createExpense(expenseObj, { transaction: t });
        const totalExp1 = req.user.totalExpense;
        const newTotalExp = parseInt(totalExp1) + parseInt(Amount);
        await req.user.update({ 'totalExpense': newTotalExp }, { transaction: t })
        await t.commit();
        return res.send(expense);
    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({ success: false, error: err });
    }
}

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await UserServices.getExpenses(req);
        res.send(expenses);
    }
    catch (err) {
        console.log(err);
    }
}

exports.deleteExpense = async (req, res) => {
    const t = await sequelize.transaction();
    const newExp = parseInt(req.user.totalExpense) - parseInt(req.body.Amount);
    try {
        await req.user.update({ 'totalExpense': newExp }, { transaction: t });
        const response = await Expense.destroy({ where: { id: req.body.id } }, { transaction: t });
        if (response == 1) {
            await t.commit();
            res.send(`Succesfully deleted expense with ID: ${req.body.id}`)
        }
        else {
            await t.rollback();
            res.status(204).send("Something went wrong, expense not in DB");
        }
    }
    catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json({success:false,error:err});
    }
}