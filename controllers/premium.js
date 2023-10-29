const Sequelize = require('sequelize');
const User = require('../models/user');
const Expense = require('../models/expense');
const Reports = require('../models/report');
const UserServices = require('../services/userservices');
const S3Services = require('../services/S3services');
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
            group: ['User.id'], // Group by userId to calculate total expenses per user
            order: [[Sequelize.literal('totalExpenses'), 'DESC']] // Order by total expenses in descending order
        })
        return res.status(200).send(users);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ sucess: false, error: new Error(err) });
    }
}

exports.getReports = async (req, res) => {
    try {
        const reports = await UserServices.getReports(req);
        res.status(200).send(reports);
    }
    catch (err) {
        res.send(err);
    }
}


exports.downloadReport = async (req, res) => {
    try {
        const expenses = await UserServices.getExpenses(req);
        const stringifiedExp = JSON.stringify(expenses);
        const userID = req.user.id;
        const fileName = `Expenses${userID}/${new Date()}.txt`;
        const fileURL = await S3Services.uploadToS3(stringifiedExp, fileName);
        const downloadedReportsTableInsert = await req.user.createReport({ url: fileURL });
        res.status(200).send({ fileURL,createdAt:downloadedReportsTableInsert.createdAt ,sucess: true });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, err });
    }
}

