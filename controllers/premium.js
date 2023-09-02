const User = require('../models/user');
const Expense = require('../models/expense');

exports.getLeaderBoard = async (req, res) => {
    try {
        var respList = [];
        const users = await User.findAll();
        for (let i = 0; i < users.length; i++) {
            const expenses = await Expense.findAll({ where: { userId: users[i].id } })
            let amt = 0;
            expenses.forEach(exp => {
                amt += parseInt(exp.Amount);
            })
            respList[i] = { id: users[i].id, name: users[i].Name, total_expense: amt }
        };

        for (let i = 0; i < respList.length - 1; i++) {
            let max = i;
            for (let j = i + 1; j < respList.length; j++) {
                if (respList[max].total_expense < respList[j].total_expense) {
                    max = j;
                }
            }
            let tmp = respList[i];
            respList[i] = respList[max];
            respList[max] = tmp;
        }
        return res.status(200).json(respList);
    }
    catch (err) {
        throw new Error(JSON.stringify(err));
    }
}