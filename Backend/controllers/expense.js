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
        const page = parseInt(req.query.page)||1;
        const expPerPage = parseInt(req.query.expPerPg)||10;
        //console.log('dfdsfsdfsdfs df sf sf:::::: ',expPerPage)
        const countExp = await Expense.count({where:{userId:req.user.id}});
        const expenses = await UserServices.getExpenses(req, { offset: (page - 1) * expPerPage, limit: expPerPage });
        let numOfPages = parseInt(countExp / expPerPage);
        if (countExp % expPerPage != 0) numOfPages++;
        let expenseOp = {
            expenses: expenses,
            currentPage: page, 
            lastPage: numOfPages, 
            hasPrevious: (page - 1 > 0) ? true : false, 
            hasNext: ((page < numOfPages) ? true : false), 
            next: page + 1
        }
        res.send(expenseOp);
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
        res.status(500).json({ success: false, error: err });
    }
}