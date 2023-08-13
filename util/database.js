const {Sequelize} = require('sequelize');
const sequelize = new Sequelize('expense','root','#Ash28jun#',{host:'localhost',dialect:'mysql'});

module.exports = sequelize;