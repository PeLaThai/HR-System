const BaseModel = require("../base");
import { OPTION_DB_RELATIONSHIP } from "../../../common/constant"

module.exports = class formCategory extends BaseModel {
    static tableName = "formCategory";
    static modelName = "formCategory";
    static schema = require("./schema")
    static associate(models) {
        this.hasMany(models.Form, {
            foreignKey: "typeId",
            as: "formCategoryData",
            onDelete: OPTION_DB_RELATIONSHIP.CASCADE,
            onUpdate: OPTION_DB_RELATIONSHIP.CASCADE
        })
    }

}