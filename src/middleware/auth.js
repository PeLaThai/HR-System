import jwt from "jsonwebtoken"
require("dotenv").config();
import User from "../_database/models/user"
import status from "http-status"
import { AUTH_MESSAGES } from "../common/authMsg";
import UserRole from "../_database/models/userRole";
import Role from "../_database/models/role";
import { METHODS, ROLES } from "../common/constant";
import RoleModule from "../_database/models/roleModule";
import { REGEXEXP } from "../_ultis";


const getToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.length > 0) {
        return req.headers.authorization.split(/\s+/)[1];
    }
    return ""
}
const authJWT = async (req, res, next) => {
    const token = getToken(req);
    if (!token) {
        return res.status(status.UNAUTHORIZED).json(AUTH_MESSAGES.NO_TOKEN)
    }
    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(status.UNAUTHORIZED).json(AUTH_MESSAGES.FAIL_AUTHENTICATE)
        } else {
            const userId = decoded.userId;
            const user = await User.findOne({
                where: {
                    id: userId
                },
                raw: true
            })
            req.user = user;
            return next();
        }
    })
}

const authorizationUser = async (req, res, next) => {
    const { user } = req;
    if (!user) {
        return res.status(status.UNAUTHORIZED).json(AUTH_MESSAGES.NOT_LOGGED_IN)
    }

    const userRoles = await UserRole.findAll({
        where: { userid: user.id },
        include: [
            {
                model: Role,
                as: "roleData",
                attributes: ["id"],
            },
        ],
        raw: true,
        nest: true
    })

    const method = req.method.toString().toLowerCase();
    let isPass = false;

    let paths = req.originalUrl.split("/");
    for (let i = 0; i < paths.length; i++) {
        if (REGEXEXP.test(paths[i])) {
            paths = paths.slice(0, i);
            break;
        }
    }
    const api = paths.join("/");

    for (let i = 0; i < userRoles.length; i++) {
        //Check if user is admin then can access to all APis
        if (userRoles[i].roleData.id === ROLES.ADMIN) {
            isPass = true;
            break;
        }
        const roleModule = await RoleModule.findOne({
            where: { api: api, roleId: userRoles[i].roleData.id }
        })
        if (!roleModule) break;
        switch (method) {
            case METHODS.GET:
                if (roleModule.isCanRead) isPass = true;
                break;
            case METHODS.POST:
                if (roleModule.isCanAdd) isPass = true;
                break;
            case METHODS.PUT:
                if (roleModule.isCanEdit) isPass = true;
                break;
            case METHODS.PATCH:
                if (roleModule.isCanEdit) isPass = true;
                break;
            case METHODS.DELETE:
                if (roleModule.isCanEdit) isPass = true;
                break;
        }
    }
    if (isPass) return next();
    return res.status(status.UNAUTHORIZED).json(AUTH_MESSAGES.AUTHORIZE_FORBIDDEN);
}

module.exports = {
    authJWT: authJWT,
    authorizationUser: authorizationUser
}