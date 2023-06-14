const BaseModel = require("../base");
import { OPTION_DB_RELATIONSHIP } from "../../../common/constant"

module.exports = class Role extends BaseModel {
    static tableName = "Role";
    static modelName = "Role";
    static schema = require("./schema")
    static associate(models) {
        this.hasMany(models.UserRole, {
            foreignKey: "roleId",
            as: "roleData",
            onDelete: OPTION_DB_RELATIONSHIP.CASCADE,
            onUpdate: OPTION_DB_RELATIONSHIP.CASCADE
        }),
            this.hasMany(models.RoleModule, {
                foreignKey: "roleId",
                as: "roleModule",
                onDelete: OPTION_DB_RELATIONSHIP.CASCADE,
                onUpdate: OPTION_DB_RELATIONSHIP.CASCADE
            })
    }

}