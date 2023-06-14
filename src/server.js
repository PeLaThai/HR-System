import express from "express";
import bodyParser from "body-parser";
import config from "./config/index";
import db from "./_database/db";
import routes from "./routes"

//import connectDB from "./config/database"
require("dotenv").config();
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/Images", express.static("./Images"))

const initSequelize = async () => {
    await db.connect()
        .then(() => {
            console.log("Connection has been established succesfully");
            return true;
        }).catch(err => {
            console.log("Connection fail:", err);
            return false;
        })
}
const initWebroute = () => {
    app.use("/api/v1", routes);
    console.log("Register services suceesfully");
}
const startServer = async () => {
    app.listen(config.port, config.host);
    initSequelize();
    initWebroute();
    console.log(`Listening on host ${config.host} on port ${config.port} http://${config.host}:${config.port}`);
};
startServer();




