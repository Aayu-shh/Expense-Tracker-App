const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey: true
        
    },
    Name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    Email:{
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    Password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    isPremiumUser:Sequelize.BOOLEAN
})

module.exports = User;
