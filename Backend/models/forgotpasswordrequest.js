const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const fgr = sequelize.define('forgotpasswordrequest',{
    id:{
        type:Sequelize.UUID,          //uuid here
        allowNull:false,
        primaryKey:true
    },
    isActive:{
        type:Sequelize.BOOLEAN,
        defaultValue:true
    }
})

module.exports = fgr;