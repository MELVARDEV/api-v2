const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite',
    logging: false
});

const User = sequelize.define('User', {
    // Model attributes are defined here
    login: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
    },

}, {
});

sequelize.sync({ alter: true }) // Sync table columns when model gets changed
module.exports = User;