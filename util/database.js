const {Sequelize} = require('sequelize');
const sequelize = new Sequelize('expense','root',process.env.DB_PASS,{host:'localhost',dialect:'mysql'});

module.exports = sequelize;