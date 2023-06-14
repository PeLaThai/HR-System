const Sequelize = require("sequelize");
module.exports = {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    api: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isCanRead: {
        type: Sequelize.BOOLEAN,
    },
    isCanAdd: {
        type: Sequelize.BOOLEAN,
    },
    isCanEdit: {
        type: Sequelize.BOOLEAN,
    },
    isCanDelete: {
        type: Sequelize.BOOLEAN,
    },
}