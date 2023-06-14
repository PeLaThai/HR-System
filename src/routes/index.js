import express from "express";
import userRouter from "./userRoute"
import formRouter from "./formRoute"

const routers = express.Router();
routers.use(userRouter);
routers.use(formRouter);

module.exports = routers;