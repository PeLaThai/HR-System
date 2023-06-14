const Sequelize = require("sequelize");
import { FORM_STATUS } from "../../../common/constant";
module.exports = {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV1
    },
    typeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: FORM_STATUS.OPEN
    },
    expDate: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
    }
}