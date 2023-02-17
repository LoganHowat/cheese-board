const {sequelize} = require('../db');
const { Sequelize } = require('sequelize');

// TODO - create a Menu model
const User = sequelize.define('user', {
    name: Sequelize.STRING,
    email: Sequelize.STRING
});

module.exports = {User};