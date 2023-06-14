const BaseModel = require("../base");

module.exports = class roleModule extends BaseModel {
    static tableName = "roleModule";
    static modelName = "roleModule";
    static schema = require("./schema");
    static associate(models) {
        this.belongsTo(models.Role, {
            foreignKey: "roleId",
            targetKey: "id",
            as: "role",
        });
    }
};
