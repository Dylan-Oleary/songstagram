const errorNames = {
    BAD_REQUEST: "BAD_REQUEST",
    EMAIL_ALREADY_TAKEN: "EMAIL_ALREADY_TAKEN",
    MISSING_REQUIRED_FIELDS: "MISSING_REQUIRED_FIELDS",
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
    PASSWORDS_DO_NOT_MATCH: "PASSWORDS_DO_NOT_MATCH",
    SERVER_ERROR: "SERVER_ERROR",
    USER_ALREADY_LOGGED_IN: "USER_ALREADY_LOGGED_IN",
    USER_DOES_NOT_EXIST: "USER_DOES_NOT_EXIST",
    USERNAME_ALREADY_TAKEN: "USERNAME_ALREADY_TAKEN",
    USERNAME_AND_EMAIL_TAKEN: "USERNAME_AND_EMAIL_TAKEN"
};

const errorTypes = {
    BAD_REQUEST: {
        status: 400,
        message: "This request is invalid"
    },
    EMAIL_ALREADY_TAKEN: {
        status: 409,
        message: "This email is already taken"
    },
    MISSING_REQUIRED_FIELDS: {
        status: 400,
        message: "One or more required fields are missing"
    },
    INVALID_CREDENTIALS: {
        status: 401,
        message: "Invalid Credentials"
    },
    PASSWORDS_DO_NOT_MATCH: {
        status: 401,
        message: "Passwords do not match"
    },
    SERVER_ERROR: {
        status: 500,
        message: "An unexpected server error has occurred"
    },
    USER_ALREADY_LOGGED_IN: {
        status: 400,
        message: "User is already logged in"
    },
    USER_DOES_NOT_EXIST: {
        status: 404,
        message: "User does not exist"
    },
    USERNAME_ALREADY_TAKEN: {
        status: 409,
        message: "This username is already taken"
    },
    USERNAME_AND_EMAIL_TAKEN: {
        status: 409,
        message: "This email and username are already taken"
    }
};

module.exports = {
    errorNames,
    errorTypes
};