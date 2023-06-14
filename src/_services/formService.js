import Form from "../_database/models/form"
import UserForm from "../_database/models/userForm"
import FormDetail from "../_database/models/formDetail"
import FormCategory from "../_database/models/formCategory"
import User from "../_database/models/user"
import { sequelize } from "../config/database"
import { FORM_CATEGORY, FORM_STATUS } from "../common/constant"
import { Op } from "sequelize"
import { USER_MESSAGE } from "../common/userMessage"
import { FORM_MESSAGE } from "../common/formMessage"
import { ERR_CODE } from "../common/errCode"
import { MAIL_CONTENT } from "../common/mailContent"
import status from "http-status";
import sendMail from "../_ultis/mailer";

class formService {

    getAllForm = async (pageIndex, pageSize) => {
        const forms = await Form.findAll({
            where: { isDeleted: 0 },
            raw: true
        })
        const start = (parseInt(pageIndex) - 1) * pageSize;
        const end = start + pageSize;
        return ({
            data: forms.slice(start, end),
            pageIndex: pageIndex,
            pageSize: pageSize,
            totalCount: forms.length,
            totalPage: Math.round(forms.length / pageSize),
            errCode: ERR_CODE.OK,
            errMsg: USER_MESSAGE.USER_FOUND,
            status: status.OK
        })
    }

    getFormById = async (formId) => {
        const form = await Form.findAll({
            where: { id: formId },
            include: [
                {
                    model: FormCategory,
                    as: "categoryData"
                },
                {
                    model: UserForm,
                    as: "userFormData"
                }
            ],
            raw: true,
            nest: true
        })
        if (form && form.length > 0) {
            return ({
                data: form,
                errCode: ERR_CODE.OK,
                errMsg: FORM_MESSAGE.FORM_FOUND,
                status: status.OK
            })
        }
        return ({
            errCode: ERR_CODE.ERROR_FROM_SEVER,
            errMsg: FORM_MESSAGE.FORM_NOT_FOUND,
            status: status.NOT_FOUND
        })
    }

    createForm = async (data) => {
        const form = await Form.create({
            ...data,
            typeId: FORM_CATEGORY[data.categoryName],
        })
        return ({
            data: form,
            errCode: ERR_CODE.OK,
            errMsg: FORM_MESSAGE.FORM_CREATED,
            status: status.CREATED
        })
    }

    deleteForm = async (formId) => {
        const form = await Form.findOne({
            where: {
                id: formId,
                isDeleted: 0
            },
            raw: false
        })
        if (form) {
            try {
                const listUserForms = await UserForm.findAll({
                    where: { formId: formId, isDeleted: 0 },
                    raw: true
                })
                const userFormIds = listUserForms.map(u => u.id);
                const transaction = await sequelize.transaction();
                form.isDeleted = 1;
                await form.save({ transaction });

                await UserForm.update(
                    { isDeleted: 1 },
                    { where: { formId: formId }, },
                    { transaction }
                )

                await FormDetail.update(
                    { isDeleted: 1 },
                    {
                        where: {
                            formid: {
                                [Op.in]: userFormIds
                            }
                        }
                    },
                    { transaction }
                )

                await transaction.commit();
                return ({
                    errCode: ERR_CODE.OK,
                    errMsg: FORM_MESSAGE.FORM_DELETED,
                    status: status.OK
                })
            } catch (error) {
                await transaction.rollback();
                return ({
                    errCode: ERR_CODE.ERROR_FROM_SEVER,
                    errMsg: FORM_MESSAGE.TRANSACTION_ERROR,
                    status: status.INTERNAL_SERVER_ERROR
                })
            }
        }
        return ({
            errCode: ERR_CODE.ERROR_FROM_SEVER,
            errMsg: FORM_MESSAGE.FORM_NOT_FOUND,
            status: status.NOT_FOUND
        })
    }

    getAllUserForm = async (pageIndex, pageSize, keyWord) => {
        let userForms = [];
        if (keyWord.length > 0) {
            userForms = await UserForm.findAll({
                where: {
                    status: {
                        [Op.in]: keyWord
                    },
                    isDeleted: 0
                },
                raw: true
            })
        } else {
            userForms = await UserForm.findAll({
                where: {
                    isDeleted: 0
                },
                raw: true
            })
        }
        const start = (parseInt(pageIndex) - 1) * pageSize;
        const end = start + pageSize;
        return ({
            data: userForms.slice(start, end),
            pageIndex: pageIndex,
            pageSize: pageSize,
            totalCount: userForms.length,
            totalPage: Math.round(userForms.length / pageSize),
            errCode: ERR_CODE.OK,
            errMsg: USER_MESSAGE.USER_FOUND,
            status: status.OK
        })
    }

    assignUserForm = async (data) => {
        //Check form is exist or not
        const form = await Form.findOne({
            where: {
                id: data.formId,
                isDeleted: 0
            },
            raw: true
        })
        if (!form) {
            return ({
                errCode: ERR_CODE.ERROR_FROM_CLIENT,
                errMsg: FORM_MESSAGE.FORM_NOT_FOUND,
                status: status.CONFLICT
            })
        }

        //Check user is assigning any form or not
        const check = await UserForm.findAll({
            where: {
                userId: {
                    [Op.in]: data.userIds
                },
                status: {
                    [Op.notLike]: FORM_STATUS.CLOSE
                },
                isDeleted: 0
            }
        })
        if (check && check.length > 0) {
            return ({
                errCode: ERR_CODE.ERROR_FROM_SEVER,
                errMsg: FORM_MESSAGE.USER_CONFLICT,
                status: status.CONFLICT
            })
        }
        const transaction = await sequelize.transaction();
        try {
            let userForms = [];
            for (let i = 0; i < data.userIds.length; i++) {
                userForms.push({
                    userId: data.userIds[i],
                    formId: data.formId,
                    managerId: data.managerId,
                })
            }
            await UserForm.bulkCreate(userForms, { transaction })

            //Get list users to take user's emails for email sending
            const listUsers = await User.findAll({
                where: {
                    id: {
                        [Op.in]: data.userIds
                    },
                    isDeleted: 0
                },
                raw: true
            });
            //Sending email for announcement to user
            await Promise.all(
                listUsers.map(async (user) => {
                    await sendMail(user.email, form.name, MAIL_CONTENT)
                })
            )
            await transaction.commit();
            return ({
                errCode: ERR_CODE.OK,
                errMsg: FORM_MESSAGE.FORM_ASSIGNED,
                status: status.OK
            })
        } catch (error) {
            await transaction.rollback();
            return ({
                errCode: ERR_CODE.ERROR_FROM_SEVER,
                errMsg: FORM_MESSAGE.TRANSACTION_ERROR,
                status: status.INTERNAL_SERVER_ERROR
            })
        }
    }

    createUserForm = async (data) => {
        //Check user only have 1 form status not closing before create
        const check = await UserForm.findAll({
            where: {
                userId: {
                    [Op.in]: data.userIds
                },
                status: {
                    [Op.notLike]: FORM_STATUS.CLOSE
                },
                isDeleted: 0
            }
        })
        if (check && check.length > 0) {
            return ({
                errCode: ERR_CODE.ERROR_FROM_SEVER,
                errMsg: FORM_MESSAGE.USER_CONFLICT,
                status: status.CONFLICT
            })
        } else {
            const transaction = await sequelize.transaction();
            try {
                let userForms = [];
                const form = await Form.create({
                    ...data,
                    typeId: FORM_CATEGORY[data.categoryName]
                },
                    { transaction }
                );
                for (let i = 0; i < data.userIds.length; i++) {
                    userForms.push({
                        userId: data.userIds[i],
                        formId: form.id,
                        managerId: data.managerId,
                    })
                }
                await UserForm.bulkCreate(userForms, { transaction })

                //Get list users to take user's emails for email sending
                const listUsers = await User.findAll({
                    where: {
                        id: {
                            [Op.in]: data.userIds
                        },
                        isDeleted: 0
                    },
                    raw: true
                });

                await Promise.all(
                    listUsers.map(async (user) => {
                        await sendMail(user.email, data.name, MAIL_CONTENT)
                    })
                )
                await transaction.commit();
                return ({
                    data: form,
                    errCode: ERR_CODE.OK,
                    errMsg: FORM_MESSAGE.FORM_CREATED,
                    status: status.CREATED
                })
            } catch (error) {
                await transaction.rollback();
                return ({
                    errCode: ERR_CODE.ERROR_FROM_SEVER,
                    errMsg: FORM_MESSAGE.TRANSACTION_ERROR,
                    status: status.INTERNAL_SERVER_ERROR
                })
            }
        }
    }

    getUserFormById = async (formId) => {
        const userForm = await UserForm.findAll({
            where: {
                id: formId
            },
            include: [
                {
                    model: Form,
                    include: [
                        {
                            model: FormCategory,
                            as: "categoryData",
                        },
                    ],
                    as: "formUserData"
                },
                {
                    model: FormDetail,
                    as: "formDetailData"
                },
                {
                    model: User,
                    as: "user",
                    attributes: { exclude: ["password"] },
                },
                {
                    model: User,
                    as: "manager",
                    attributes: { exclude: ["password"] },
                }
            ],
            raw: true,
            nest: true
        })
        if (userForm && userForm.length > 0) {
            return ({
                data: userForm,
                errCode: ERR_CODE.OK,
                errMsg: FORM_MESSAGE.FORM_FOUND,
                status: status.OK
            })
        }
        return ({
            errCode: ERR_CODE.ERROR_FROM_SEVER,
            errMsg: FORM_MESSAGE.FORM_NOT_FOUND,
            status: status.NOT_FOUND
        })
    }

    deleteUserForm = async (formId) => {
        const userForm = await UserForm.findOne({
            where: {
                id: formId,
                isDeleted: 0
            },
            raw: false
        })
        if (userForm) {
            const transaction = await sequelize.transaction();
            userForm.isDeleted = 1;
            await userForm.save({ transaction });

            await FormDetail.update(
                { isDeleted: 1 },
                { where: { formid: formId } },
                { transaction }
            )
            await transaction.commit();
            return ({
                errCode: ERR_CODE.OK,
                errMsg: FORM_MESSAGE.FORM_DELETED,
                status: status.OK
            })
        }
        return ({
            errCode: ERR_CODE.ERROR_FROM_SEVER,
            errMsg: FORM_MESSAGE.FORM_NOT_FOUND,
            status: status.NOT_FOUND
        })
    }

    formForEmployee = async (userId, pageIndex, pageSize) => {
        const myForms = await UserForm.findAll({
            where: {
                userId: userId,
                isDeleted: 0,
            },
            include: [
                {
                    model: FormDetail,
                    as: "formDetailData"
                }
            ],
            raw: true,
            nest: true,
        })
        const start = (parseInt(pageIndex) - 1) * pageSize;
        const end = start + pageSize;
        return ({
            data: myForms.slice(start, end),
            pageIndex: pageIndex,
            pageSize: pageSize,
            totalCount: myForms.length,
            totalPage: Math.round(myForms.length / pageSize),
            errCode: ERR_CODE.OK,
            errMsg: FORM_MESSAGE.FORM_FOUND,
            status: status.OK
        })
    }

    formForManager = async (managerId, pageIndex, pageSize) => {
        const myForms = await UserForm.findAll({
            where: {
                managerId: managerId,
                isDeleted: 0,
                status: FORM_STATUS.SUBMITTED,
            },
            include: [
                {
                    model: FormDetail,
                    as: "formDetailData"
                }
            ],
            raw: true,
            nest: true,
        })
        const start = (parseInt(pageIndex) - 1) * pageSize;
        const end = start + pageSize;
        return ({
            data: myForms.slice(start, end),
            pageIndex: pageIndex,
            pageSize: pageSize,
            totalCount: myForms.length,
            totalPage: Math.round(myForms.length / pageSize),
            errCode: ERR_CODE.OK,
            errMsg: FORM_MESSAGE.FORM_FOUND,
            status: status.OK
        })
    }

    updateUserForm = async (data, givenId, user) => {
        const updatedForm = await UserForm.update(data, { where: { id: givenId, userId: user.id, isDeleted: 0 } })
        if (!updatedForm) {
            return ({
                errCode: ERR_CODE.ERROR_FROM_SEVER,
                errMsg: FORM_MESSAGE.FORM_NOT_FOUND,
                status: status.NOT_FOUND
            })
        }
        return ({
            errCode: ERR_CODE.OK,
            errMsg: FORM_MESSAGE.FORM_UPDATED,
            status: status.OK
        })
    }

    submitUserForm = async (data, givenId, user) => {
        const transaction = await sequelize.transaction();
        try {
            const submitForm = await UserForm.findOne({
                where: { id: givenId, userId: user.id, status: FORM_STATUS.NEW, isDeleted: 0 }
            })
            if (!submitForm) {
                return ({
                    errCode: ERR_CODE.ERROR_FROM_SEVER,
                    errMsg: FORM_MESSAGE.FORM_NOT_FOUND,
                    status: status.NOT_FOUND
                })
            }
            submitForm.userCmt = data.userCmt;
            submitForm.status = FORM_STATUS.SUBMITTED;
            await submitForm.save({ transaction })
            //Create new form detail
            await FormDetail.create(
                {
                    formId: submitForm.id,
                    descTask: data.descTask
                },
                { transaction }
            )
            await transaction.commit();
            return ({
                errCode: ERR_CODE.OK,
                errMsg: FORM_MESSAGE.FORM_SUBMITTED,
                status: status.OK
            })
        } catch (error) {
            await transaction.rollback();
            return ({
                errCode: ERR_CODE.ERROR_FROM_SEVER,
                errMsg: FORM_MESSAGE.TRANSACTION_ERROR,
                status: status.INTERNAL_SERVER_ERROR
            })
        }
    }

    approvalForm = async (data, givenId, user) => {
        const transaction = await sequelize.transaction();
        try {
            const approvalForm = await UserForm.findOne({
                where: { id: givenId, managerId: user.id, status: FORM_STATUS.SUBMITTED, isDeleted: 0 }
            })
            if (!approvalForm) {
                return ({
                    errCode: ERR_CODE.ERROR_FROM_SEVER,
                    errMsg: FORM_MESSAGE.FORM_NOT_FOUND,
                    status: status.NOT_FOUND
                })
            }
            approvalForm.managerCmt = data.managerComment;
            approvalForm.status = FORM_STATUS.APPROVAL;
            await approvalForm.save({ transaction })
            //Update detail of form
            await FormDetail.update(
                { result: data.result, point: data.point },
                { where: { formId: approvalForm.id } },
                { transaction }
            )
            await transaction.commit();
            return ({
                errCode: ERR_CODE.OK,
                errMsg: FORM_MESSAGE.FORM_APPROVALED,
                status: status.OK
            })
        } catch (error) {
            await transaction.rollback();
            return ({
                errCode: ERR_CODE.ERROR_FROM_SEVER,
                errMsg: FORM_MESSAGE.TRANSACTION_ERROR,
                status: status.INTERNAL_SERVER_ERROR
            })
        }
    }

    closeUserForm = async (formId) => {
        const userForm = await UserForm.findOne({
            where: {
                id: formId,
                status: FORM_STATUS.APPROVAL,
                isDeleted: 0
            },
            raw: false
        })
        if (!userForm) {
            return ({
                errCode: ERR_CODE.ERROR_FROM_SEVER,
                errMsg: FORM_MESSAGE.FORM_NOT_FOUND,
                status: status.NOT_FOUND
            })
        }
        userForm.status = FORM_STATUS.CLOSE;
        await userForm.save();
        return ({
            errCode: ERR_CODE.OK,
            errMsg: FORM_MESSAGE.FORM_CLOSE,
            status: status.OK
        })
    }

    closeForm = async (formId) => {
        const transaction = await sequelize.transaction();
        try {
            const form = await Form.findOne({
                where: {
                    id: formId,
                    status: FORM_STATUS.OPEN,
                    isDeleted: 0
                },
                raw: false
            })
            if (!form) {
                return ({
                    errCode: ERR_CODE.ERROR_FROM_SEVER,
                    errMsg: FORM_MESSAGE.FORM_NOT_FOUND,
                    status: status.NOT_FOUND
                })
            }

            form.status = FORM_STATUS.CLOSE;
            await form.save({ transaction });
            await UserForm.update(
                { status: FORM_STATUS.CLOSE },
                { where: { formId: formId } },
                { transaction }
            )
            await transaction.commit();
            return ({
                errCode: ERR_CODE.OK,
                errMsg: FORM_MESSAGE.FORM_CLOSE,
                status: status.OK
            })
        } catch (error) {
            await transaction.rollback();
            return ({
                errCode: ERR_CODE.ERROR_FROM_SEVER,
                errMsg: FORM_MESSAGE.TRANSACTION_ERROR,
                status: status.INTERNAL_SERVER_ERROR
            })
        }
    }

    reportLabour = async (pageIndex, pageSize) => {
        const currentTime = new Date();
        const forms = await Form.findAll({
            where: {
                typeId: FORM_CATEGORY.LABOUR_CONTRACT,
                status: FORM_STATUS.OPEN,
                expDate: {
                    [Op.lte]: currentTime
                }
            },
            include: [
                {
                    model: UserForm,
                    where: {
                        status: {
                            [Op.notLike]: FORM_STATUS.CLOSE
                        },
                    },
                    attributes: ["userId", "status"],
                    as: "userFormData",
                    include: [
                        {
                            model: User,
                            as: "user"
                        }
                    ]
                }
            ],
            raw: true,
            nest: true
        })

        const start = (parseInt(pageIndex) - 1) * pageSize;
        const end = start + pageSize;
        return ({
            data: forms.slice(start, end),
            pageIndex: pageIndex,
            pageSize: pageSize,
            totalCount: forms.length,
            totalPage: Math.round(forms.length / pageSize),
            errCode: ERR_CODE.OK,
            errMsg: FORM_MESSAGE.FORM_FOUND,
            status: status.OK
        })
    }

    reportPerfomance = async (pageIndex, pageSize) => {
        const currentTime = new Date();
        const forms = await Form.findAll({
            where: {
                typeId: FORM_CATEGORY.PERFORMANCE_REVIEW,
                status: FORM_STATUS.OPEN,
                expDate: {
                    [Op.lte]: currentTime
                }
            },
            include: [
                {
                    model: UserForm,
                    where: {
                        status: {
                            [Op.notLike]: FORM_STATUS.CLOSE
                        },
                    },
                    attributes: ["userId", "status"],
                    as: "userFormData",
                    include: [
                        {
                            model: User,
                            as: "user"
                        }
                    ]
                }
            ],
            raw: true,
            nest: true
        })
        const start = (parseInt(pageIndex) - 1) * pageSize;
        const end = start + pageSize;
        return ({
            data: forms.slice(start, end),
            pageIndex: pageIndex,
            pageSize: pageSize,
            totalCount: forms.length,
            totalPage: Math.round(forms.length / pageSize),
            errCode: ERR_CODE.OK,
            errMsg: FORM_MESSAGE.FORM_FOUND,
            status: status.OK
        })
    }
}

module.exports = new formService();