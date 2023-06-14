const BaseModel = require("../base");
import { OPTION_DB_RELATIONSHIP } from "../../../common/constant"

module.exports = class User extends BaseModel {
    static tableName = "User";
    static modelName = "User";
    static schema = require("./schema");
    static associate(models) {
        this.hasMany(models.UserRole, {
            foreignKey: "userId",
            as: "userRole",
            onDelete: OPTION_DB_RELATIONSHIP.CASCADE,
            onUpdate: OPTION_DB_RELATIONSHIP.CASCADE,
        });
        this.hasMany(models.UserForm, {
            foreignKey: "userId",
            as: "userForm",
            onDelete: OPTION_DB_RELATIONSHIP.CASCADE,
            onUpdate: OPTION_DB_RELATIONSHIP.CASCADE,
        });
        this.hasMany(models.UserForm, {
            foreignKey: "managerId",
            as: "managerForm",
            onDelete: OPTION_DB_RELATIONSHIP.CASCADE,
            onUpdate: OPTION_DB_RELATIONSHIP.CASCADE,
        });
    }
};
