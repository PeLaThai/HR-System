const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const { sequelize } = require("../config/database");


class Db {
    constructor() {
        const models = {}
        fs
            //read all files represent models in folder models
            .readdirSync(path.join(__dirname, "models"), { withFileTypes: true })
            .filter(dir => dir.isDirectory()) // Use node version >= 10
            .map(dir => dir.name)
            .forEach(dir => {
                const model = require(path.join(__dirname, "models", dir))
                model.init(sequelize);
                models[_.upperFirst(dir)] = model;
            });
        Object.values(models)
            .filter(model => typeof model.associate === "function")
            .forEach(model => model.associate(models));
    }
    getSequelize() {
        return sequelize;
    }
    connect() {
        let connectPromise = sequelize
            .authenticate()
            .then(() => {
                console.log(`Connected to database: ${sequelize.config.database}`);
                return sequelize.sync().then(() => {
                    return sequelize;
                });
            })
            .catch(error => {
                throw error;
            });
        return connectPromise;
    }
}
module.exports = new Db();