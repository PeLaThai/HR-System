const { Sequelize } = require("sequelize")

module.exports = class BaseModel extends Sequelize.Model {
    static tableName = "";
    static modelName = "";
    static schema = {};
    static timestamps = true;
    static association(models) {
    }
    /**
     * Initial model
     * *provide documentation and context for the parameter.
     * @param {Object} sequelize Sequelize instance
     */

    static init(sequelize) {
        if (!this.tableName || !this.modelName || !Object.keys(this.schema).length) {
            throw new Error("model name or table name and schema can not be empty")
        }
        return super.init({
            ...this.schema,
            createdBy: {
                type: Sequelize.STRING,
            },
            createdAt: {
                type: Sequelize.DATE
            },
            updatedBy: {
                type: Sequelize.STRING,
            },
            updatedAt: {
                type: Sequelize.DATE
            }
        },
            //These options are merged with the default define options provided to the Sequelize constructor
            {
                tableName: this.tableName,
                modelName: this.modelName,
                sequelize,
                timestamps: this.timestamps
            })

    }
}