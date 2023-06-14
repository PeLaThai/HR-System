const Sequelize = require("sequelize");
import { FORM_STATUS } from "../../../common/constant";
module.exports = {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    userId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    formId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    managerId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    managerCmt: {
        type: Sequelize.TEXT,
    },
    userCmt: {
        type: Sequelize.TEXT,
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: FORM_STATUS.NEW
    },
    description: {
        type: Sequelize.STRING,
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    }
}