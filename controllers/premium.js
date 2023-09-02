const User = require('../models/user');
const Expense = require('../models/expense');
const Sequelize = require('sequelize');
exports.getLeaderBoard = async (req, res) => {
    try {
        // Fetch all users id,Name and their total expenses
        const users = await User.findAll({
            attributes: [
                'id',
                'Name',
                [Sequelize.fn('SUM', Sequelize.col('expenses.Amount')), 'totalExpenses']
            ],
            include: [
                {
                    model: Expense,
                    as: 'expenses', // Alias for the Expense model
                    attributes: [],
                },
            ],
            group: ['User.id'], // Group by user to calculate total expenses per user
            order: [[Sequelize.literal('totalExpenses'), 'DESC']] // Order by total expenses in descending order
        })
        return res.status(200).send(users);
    }
    catch (err) {
        console.log(err)
    }
}