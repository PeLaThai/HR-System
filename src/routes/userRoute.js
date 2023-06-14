import express from "express";
import uploadFile from "../middleware/uploadFile"
import UserController from "../controller/userController"
import authService from "../middleware/auth";

const userRouter = express.Router();
userRouter.post("/user/login", UserController.handleLogin)
userRouter.get("/user/my-infor", authService.authJWT, UserController.getUserInfor)
userRouter.get("/user/:id", authService.authJWT, authService.authorizationUser, UserController.getUserById)
userRouter.get("/user", authService.authJWT, authService.authorizationUser, UserController.getAllUser)
userRouter.post("/user/create", authService.authJWT, authService.authorizationUser, uploadFile.upload.single("avatar"), UserController.createUser)
userRouter.put("/user/update/:id", authService.authJWT, authService.authorizationUser, uploadFile.upload.single("avatar"), UserController.updateUser)
userRouter.delete("/user/delete/:id", authService.authJWT, authService.authorizationUser, UserController.softDelete)



module.exports = userRouter