const BaseModel = require("../base");
import { OPTION_DB_RELATIONSHIP } from "../../../common/constant"

module.exports = class userForm extends BaseModel {
    static tableName = "userForm";
    static modelName = "userForm";
    static schema = require("./schema");
    static associate(models) {
        this.belongsTo(models.User, {
            foreignKey: "userId",
            targetKey: "id",
            as: "user",
        });
        this.belongsTo(models.User, {
            foreignKey: "managerId",
            targetKey: "id",
            as: "manager",
        });
        this.belongsTo(models.Form, {
            foreignKey: "formId",
            targetKey: "id",
            as: "formUserData",
        });
        this.hasMany(models.FormDetail, {
            foreignKey: "formId",
            as: "formDetailData",
            onDelete: OPTION_DB_RELATIONSHIP.CASCADE,
            onUpdate: OPTION_DB_RELATIONSHIP.CASCADE,
        })
    }
};
