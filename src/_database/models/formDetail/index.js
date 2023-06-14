const BaseModel = require("../base");

module.exports = class formDetail extends BaseModel {
    static tableName = "formDetail";
    static modelName = "formDetail";
    static schema = require("./schema");
    static associate(models) {
        this.belongsTo(models.UserForm, {
            foreignKey: "formId",
            targetKey: "id",
            as: "userFormDetailData",
        });
    }
};
