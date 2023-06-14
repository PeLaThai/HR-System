const Sequelize = require("sequelize");
module.exports = {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    formId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    result: {
        type: Sequelize.STRING,
    },
    point: {
        type: Sequelize.INTEGER,
    },
    descTask: {
        type: Sequelize.TEXT,
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    }
}