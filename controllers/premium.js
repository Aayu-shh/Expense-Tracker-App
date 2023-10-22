const AWS = require('aws-sdk');
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

exports.getReport = async (req, res) => {

}


function uploadToS3(data, fileName) {
    const BUCKET_NAME = 'expensetrackerapp2';
    //Initialize bucket
    let s3bucket = new AWS.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET,
    })

    var params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((resolve,reject)=>{

        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(s3response.Location);
            }
        });
    })
}

exports.downloadReport = async (req, res) => {
    try{
    const expenses = await req.user.getExpenses();
    const stringifiedExp = JSON.stringify(expenses);
    const userID = req.user.id;
    const fileName = `Expenses${userID}/${new Date()}.txt`;
    const fileURL = await uploadToS3(stringifiedExp, fileName);
    res.status(200).send({ fileURL, sucess: true });
    }
    catch(err){
        console.log(err);
        res.status(500).json({success:false,err});
    }
}

