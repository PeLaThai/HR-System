const BaseModel = require("../base");
import { OPTION_DB_RELATIONSHIP } from "../../../common/constant"

module.exports = class Form extends BaseModel {
    static tableName = "Form";
    static modelName = "Form";
    static schema = require("./schema")
    static associate(models) {
        this.belongsTo(models.FormCategory, {
            foreignKey: "typeId",
            targetKey: "id",
            as: "categoryData",
        }),
            this.hasMany(models.UserForm, {
                foreignKey: "formId",
                as: "userFormData",
                onDelete: OPTION_DB_RELATIONSHIP.CASCADE,
                onUpdate: OPTION_DB_RELATIONSHIP.CASCADE
            })
    }

}