const FORM_STATUS = {
    OPEN: "OPEN",
    CLOSE: "CLOSED",
    NEW: "NEW",
    SUBMITTED: "SUBMITTED",
    APPROVAL: "APPROVAL",
}

const FORM_CATEGORY = {
    LABOUR_CONTRACT: 1,
    PERFORMANCE_REVIEW: 2,
}

const ROLES = {
    ADMIN: 1,
    DIRECTOR: 2,
    HR: 3,
    MANAGER: 4,
    EMPLOYEE: 5,
}

const OPTION_DB_RELATIONSHIP = {
    CASCADE: "CASCADE"
}

const METHODS = {
    GET: "get",
    POST: "post",
    PUT: "put",
    PATCH: "patch",
    DELETE: "delete",
}

const DEFAULT_VALUE = {
    FIRST_EMP_STRING: "ID",
    FIRST_EMP_CODE: "ID0001",
}

module.exports = { FORM_CATEGORY, FORM_STATUS, ROLES, OPTION_DB_RELATIONSHIP, METHODS, DEFAULT_VALUE };
