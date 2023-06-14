import User from "../_database/models/user"
import UserRole from "../_database/models/userRole"
import UserForm from "../_database/models/userForm"
import FormDetail from "../_database/models/formDetail"
import Role from "../_database/models/role"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { USER_MESSAGE, } from "../common/userMessage"
import { DEFAULT_VALUE } from "../common/constant";
import { ERR_CODE } from "../common/errCode";
import status from "http-status";



var hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const salt = bcrypt.genSaltSync(10);
            let hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
}

var generateEmpCode = (number) => {
    const defaultValue = DEFAULT_VALUE.FIRST_EMP_STRING;
    number = number + 1;
    let str = String(number);
    while (str.length < 4) str = "0" + str;
    return defaultValue.concat(str);
}

class UserService {

    handleLogin = async (data) => {
        const user = await User.findOne({
            where: {
                email: data.email
            }
        })
        if (user) {
            let check = bcrypt.compareSync(data.password, user.password)
            if (check) {
                const token = jwt.sign(
                    { userId: user.id },
                    process.env.SECRET_KEY
                )
                return ({
                    data: user,
                    token: token,
                    errCode: ERR_CODE.OK,
                    errMsg: USER_MESSAGE.LOGIN_SUCCEED,
                    status: status.OK
                })
            }
            return ({
                errCode: ERR_CODE.ERROR_FROM_CLIENT,
                errMsg: USER_MESSAGE.PASSWORDS_WRONG,
                status: status.UNAUTHORIZED
            })
        }
        return ({
            errCode: ERR_CODE.ERROR_FROM_SEVER,
            errMsg: USER_MESSAGE.USER_NOT_FOUND,
            status: status.NOT_FOUND
        })
    }

    createUser = async (data, avatar) => {
        const existUser = await User.findOne({
            where: {
                email: data.email
            }
        })
        if (existUser) {
            return ({
                errCode: ERR_CODE.ERROR_FROM_CLIENT,
                errMsg: USER_MESSAGE.DUPLICATE_EMAIL,
                status: status.CONFLICT
            })
        }
        let newCode = "";
        const lastUser = await User.findOne({
            order: [
                ["createdAt", "DESC"]
            ]
        })
        if (!lastUser) {
            newCode = DEFAULT_VALUE.FIRST_EMP_CODE;
        } else {
            const number = parseInt(lastUser.empCode.substring(2));
            newCode = generateEmpCode(number);
        }
        const passwordHahsed = await hashUserPassword(data.password);
        const newUser = await User.create({
            ...data,
            empCode: newCode,
            password: passwordHahsed,
            avatar: avatar,
        })
        return ({
            data: newUser,
            errCode: ERR_CODE.OK,
            errMsg: USER_MESSAGE.USER_CREATED,
            status: status.CREATED
        })
    }

    updateUser = async (data, userId, avatar) => {
        const passwordHahsed = await hashUserPassword(data.password)
        const user = await User.findOne(
            {
                where: { id: userId, isDeleted: 0 },
                raw: false,
            }
        );
        if (user) {
            user.update({
                ...data,
                password: passwordHahsed,
                avatar: avatar
            })
            await user.save();
            return ({
                data: user,
                errCode: ERR_CODE.OK,
                errMsg: USER_MESSAGE.USER_UPDATED,
                status: status.OK
            })
        }
        return ({
            errCode: ERR_CODE.ERROR_FROM_CLIENT,
            errMsg: USER_MESSAGE.USER_NOT_FOUND,
            status: status.NOT_FOUND
        })
    }

    softDelete = async (userId) => {
        const user = await User.findOne({
            where: {
                id: userId,
                isDeleted: 0
            },
            raw: false
        })
        if (user) {
            user.isDeleted = 1;
            await user.save();
            return ({
                errCode: ERR_CODE.OK,
                errMsg: USER_MESSAGE.USER_DELETED,
                status: status.OK
            })
        }
        return ({
            errCode: ERR_CODE.ERROR_FROM_SEVER,
            errMsg: USER_MESSAGE.USER_NOT_FOUND,
            status: status.NOT_FOUND
        })
    }

    getUserById = async (userId) => {
        const user = await User.findAll({
            where: {
                id: userId
            },
            include: [
                {
                    model: UserRole,
                    include: [
                        {
                            model: Role,
                            as: "roleData",
                            attributes: ["name"],
                        },
                    ],
                    attributes: ["roleid"],
                    as: "userRole"
                },
            ],
            raw: true,
            nest: true
        })
        if (user && user.length > 0) {
            return ({
                data: user,
                errCode: ERR_CODE.OK,
                errMsg: USER_MESSAGE.USER_FOUND,
                status: status.OK
            })
        }
        return ({
            errCode: ERR_CODE.ERROR_FROM_SEVER,
            errMsg: USER_MESSAGE.USER_NOT_FOUND,
            status: status.NOT_FOUND
        })
    }

    getAllUser = async (pageIndex, pageSize) => {
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
            where: { isDeleted: 0 },
            raw: true
        })
        const start = (parseInt(pageIndex) - 1) * pageSize;
        const end = start + pageSize;
        return ({
            data: users.slice(start, end),
            pageIndex: pageIndex,
            pageSize: pageSize,
            totalCount: users.length,
            totalPage: Math.round(users.length / pageSize),
            errCode: ERR_CODE.OK,
            errMsg: USER_MESSAGE.USER_FOUND,
            status: status.OK
        })
    }

    getUserInfor = async (userId) => {
        const user = await User.findAll({
            where: {
                id: userId
            },
            include: [
                {
                    model: UserRole,
                    include: [
                        {
                            model: Role,
                            as: "roleData",
                            attributes: ["name"],
                        },
                    ],
                    attributes: ["roleid"],
                    as: "userRole"
                },
                {
                    model: UserForm,
                    include: [
                        {
                            model: FormDetail,
                            as: "formDetailData"
                        }
                    ],
                    as: "userForm"
                },
                {
                    model: UserForm,
                    include: [
                        {
                            model: FormDetail,
                            as: "formDetailData"
                        }
                    ],
                    as: "managerForm"
                }
            ],
            raw: true,
            nest: true
        })
        if (user && user.length > 0) {
            return ({
                data: user,
                errCode: ERR_CODE.OK,
                errMsg: USER_MESSAGE.USER_FOUND,
                status: status.OK
            })
        }
        return ({
            errCode: ERR_CODE.ERROR_FROM_SEVER,
            errMsg: USER_MESSAGE.USER_NOT_FOUND,
            status: status.NOT_FOUND
        })
    }
}

module.exports = new UserService();