const {Sequelize} = require('sequelize');
const sequelize = require('../util/database');

const Expense = sequelize.define('expense',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    Amount:{
        type:Sequelize.STRING,
    },
    Description:Sequelize.STRING,
    Category:Sequelize.STRING
})

module.exports = Expense;