import formService from "../_services/formService"
import formValidation from "../validation/formValidation"
import http_status from "http-status"
import { getPaginInfor } from "../_ultis/getPage"
import { FORM_MESSAGE } from "../common/formMessage"



class FormController {

    getAllForms = async (req, res) => {
        try {
            const { pageIndex, pageSize } = getPaginInfor(req);
            const result = await formService.getAllForm(pageIndex, pageSize);
            return res.status(result.status).json(result)
        } catch (error) {
            return res.status(http_status.INTERNAL_SERVER_ERROR).json(error);
        }
    }

    getFormById = async (req, res) => {
        try {
            const formId = req.params?.id;
            const result = await formService.getFormById(formId);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(http_status.INTERNAL_SERVER_ERROR).json(error);
        }
    }

    createForm = async (req, res) => {
        try {
            let result = {};
            let data = req.body;
            const { error, value } = formValidation.validateForm.validate(data)
            if (error) {
                return res.status(http_status.BAD_REQUEST).json(error.details[0].message);
            }
            if (data.userIds && data.userIds.length > 0) {
                result = await formService.createUserForm(value);
            } else {
                result = await formService.createForm(value);
            }
            return res.status(result.status).json(result)
        } catch (error) {
            return res.status(http_status.INTERNAL_SERVER_ERROR).json(error);
        }
    }

    assignUserForm = async (req, res) => {
        try {
            const data = req.body;
            const { error, value } = formValidation.assignUserForm.validate(data)
            if (error) {
                return res.status(http_status.BAD_REQUEST).json(error.details[0].message);
            }
            const result = await formService.assignUserForm(value);
            return res.status(result.status).json(result)
        } catch (error) {
            return res.status(http_status.INTERNAL_SERVER_ERROR).json(error);
        }
    }

    deleteForm = async (req, res) => {
        try {
            const formId = req.params.id
            const result = await formService.deleteForm(formId);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(http_status.INTERNAL_SERVER_ERROR).json(error);
        }
    }

    getAllUserForm = async (req, res) => {
        try {
            let keyWord = [];
            const status = req.query?.keyword;
            if (status) {
                keyWord = status.toString().split(",");
            }
            const { pageIndex, pageSize } = getPaginInfor(req);
            const result = await formService.getAllUserForm(pageIndex, pageSize, keyWord);
            return res.status(result.status).json(result)
        } catch (error) {
            console.log(error);
            return res.status(http_status.INTERNAL_SERVER_ERROR).json(error);
        }
    }

    getUserFormById = async (req, res) => {
        try {
            const formId = req.params.id;
            const result = await formService.getUserFormById(formId);
            return res.status(result.status).json(result)

        } catch (error) {
            console.log(error);
            return res.status(http_status.INTERNAL_SERVER_ERROR).json(error);
        }
    };

    deleteUserForm = async (req, res) => {
        try {
            const formId = req.params.id;
            const result = await formService.deleteUserForm(formId);
            return res.status(result.status).json(result)

        } catch (error) {
            return res.status(http_status.INTERNAL_SERVER_ERROR).json(error);
        }
    }

    formForEmployee = async (req, res) => {
        try {
            const userId = req.user.id;
            const { pageIndex, pageSize } = getPaginInfor(req);
            const result = await formService.formForEmployee(userId, pageIndex, pageSize);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(http_status.INTERNAL_SERVER_ERROR).json(error);
        }
    }

    formForManager = async (req, res) => {
        try {
            const managerId = req.user.id;
            const { pageIndex, pageSize } = getPaginInfor(req);
            const result = await formService.formForManager(managerId, pageIndex, pageSize);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(http_status.INTERNAL_SERVER_ERROR).json(error);
        }
    }

    updateUserForm = async (req, res) => {
        try {
            const data = req.body;
            const { error, value } = formValidation.updateUserForm.validate(data);
            if (error) {
                return res.status(http_status.BAD_REQUEST).json(error.details[0].message);
            }
            const result = await formService.updateUserForm(value, req.params.id, req.user);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(http_status.INTERNAL_SERVER_ERROR).json(error);
        }
    }

    submitForm = async (req, res) => {
        try {
            const data = req.body;
            const { error, value } = formValidation.submitUserForm.validate(data);
            if (error) {
                return res.status(http_status.BAD_REQUEST).json(error.details[0].message);
            }
            const result = await formService.submitUserForm(value, req.params.id, req.user);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(http_status.INTERNAL_SERVER_ERROR).json(error);
        }
    }

    approvalForm = async (req, res) => {
        try {
            const data = req.body;
            const { error, value } = formValidation.approvalUserForm.validate(data);
            if (error) {
                return res.status(http_status.BAD_REQUEST).json(error.details[0].message);
            }
            const result = await formService.approvalForm(value, req.params.id, req.user);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(http_status.INTERNAL_SERVER_ERROR).json(error);
        }
    }

    closeForm = async (req, res) => {
        try {
            const formId = req.params.id;
            const result = await formService.closeForm(formId);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(http_status.INTERNAL_SERVER_ERROR).json(error);
        }
    }

    closeUserForm = async (req, res) => {
        try {
            const formId = req.params.id;
            const result = await formService.closeUserForm(formId);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(http_status.INTERNAL_SERVER_ERROR).json(error);
        }
    }

    reportLabour = async (req, res) => {
        try {
            const { pageIndex, pageSize } = getPaginInfor(req);
            const result = await formService.reportLabour(pageIndex, pageSize);
            return res.status(result.status).json(result)
        } catch (error) {
            return res.status(http_status.INTERNAL_SERVER_ERROR).json(error);
        }
    }

    reportPerfomance = async (req, res) => {
        try {
            const { pageIndex, pageSize } = getPaginInfor(req);
            const result = await formService.reportPerfomance(pageIndex, pageSize);
            return res.status(result.status).json(result)
        } catch (error) {
            return res.status(http_status.INTERNAL_SERVER_ERROR).json(error);
        }
    }
}

module.exports = new FormController();