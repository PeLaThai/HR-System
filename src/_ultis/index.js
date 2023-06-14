"use strict";

const EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
const PASSWORD_REGEX = /^[A-Za-z\d@$!%*#?&]{6,}$/
const PHONE_NUMBER_REGEX = /^[0-9\s- \+]{8,13}$/
const REGEXEXP = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

export {
    EMAIL_REGEX,
    PASSWORD_REGEX,
    PHONE_NUMBER_REGEX,
    REGEXEXP,
};