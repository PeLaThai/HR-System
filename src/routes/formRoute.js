import express from "express";
import FormController from "../controller/formController";
import authService from "../middleware/auth";


const formRouter = express.Router();

//Form
formRouter.post("/form", authService.authJWT, authService.authorizationUser, FormController.createForm)
formRouter.get("/form", authService.authJWT, authService.authorizationUser, FormController.getAllForms)
formRouter.get("/form/:id", authService.authJWT, authService.authorizationUser, FormController.getFormById)
formRouter.delete("/form/:id", authService.authJWT, authService.authorizationUser, FormController.deleteForm)

//Admin + HR
formRouter.get("/user-form", authService.authJWT, authService.authorizationUser, FormController.getAllUserForm)
formRouter.get("/user-form/:id", authService.authJWT, authService.authorizationUser, FormController.getUserFormById)
formRouter.delete("/user-form/:id", authService.authJWT, authService.authorizationUser, FormController.deleteUserForm)

//Employee
formRouter.get("/employee-form", authService.authJWT, authService.authorizationUser, FormController.formForEmployee)
formRouter.post("/form/submit-form/:id", authService.authJWT, authService.authorizationUser, FormController.submitForm)
formRouter.put("/form/user-update-form/:id", authService.authJWT, authService.authorizationUser, FormController.updateUserForm)

//Manager
formRouter.get("/manager-form", authService.authJWT, authService.authorizationUser, FormController.formForManager)
formRouter.post("/form/approval-form/:id", authService.authJWT, authService.authorizationUser, FormController.approvalForm)

//HR
formRouter.patch("/form/close-user-form/:id", authService.authJWT, authService.authorizationUser, FormController.closeUserForm)
formRouter.patch("/form/close-form/:id", authService.authJWT, authService.authorizationUser, FormController.closeForm)
formRouter.get("/report-labour", authService.authJWT, authService.authorizationUser, FormController.reportLabour)
formRouter.get("/report-performance", authService.authJWT, authService.authorizationUser, FormController.reportPerfomance)
formRouter.post("/assign-user-form", authService.authJWT, authService.authorizationUser, FormController.assignUserForm)

module.exports = formRouter