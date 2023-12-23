const { Sequelize } = require('sequelize');
const sequilize = require('../util/database');

const Report = sequilize.define('report',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    url:{
        type: Sequelize.STRING,
        allowNull:false
    }
})

module.exports = Report;