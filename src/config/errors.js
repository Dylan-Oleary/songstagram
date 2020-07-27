const errorNames = {
    BAD_REQUEST: "BAD_REQUEST",
    EMAIL_ALREADY_TAKEN: "EMAIL_ALREADY_TAKEN",
    MISSING_REQUIRED_FIELDS: "MISSING_REQUIRED_FIELDS",
    INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
    INVALID_USER: "INVALID_USER",
    INVALID_LIKE: "INVALID_LIKE",
    INVALID_UNLIKE: "INVALID_UNLIKE",
    INVALID_FOLLOW: "INVALID_FOLLOW",
    INVALID_UNFOLLOW: "INVALID_UNFOLLOW",
    EMPTY_SPOTIFY_ID: "EMPTY_SPOTIFY_ID",
    PASSWORDS_DO_NOT_MATCH: "PASSWORDS_DO_NOT_MATCH",
    POST_DOES_NOT_EXIST: "POST_DOES_NOT_EXIST",
    SERVER_ERROR: "SERVER_ERROR",
    USER_ALREADY_LOGGED_IN: "USER_ALREADY_LOGGED_IN",
    USER_DOES_NOT_EXIST: "USER_DOES_NOT_EXIST",
    USERNAME_ALREADY_TAKEN: "USERNAME_ALREADY_TAKEN",
    USERNAME_AND_EMAIL_TAKEN: "USERNAME_AND_EMAIL_TAKEN",
    SPOTIFY_API_ERROR: "SPOTIFY_API_ERROR",
    SPOTIFY_FAILED_CONNECTION: "SPOTIFY_FAILED_CONNECTION"
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
    EMPTY_SPOTIFY_ID: {
        status: 400,
        message: "You must pass in a Spotify track ID"
    },
    MISSING_REQUIRED_FIELDS: {
        status: 400,
        message: "One or more required fields are missing"
    },
    INVALID_CREDENTIALS: {
        status: 401,
        message: "Invalid Credentials"
    },
    INVALID_USER: {
        status: 401,
        message: "Found user ID does not match given user ID"
    },
    INVALID_LIKE: {
        status: 400,
        message: "User cannot like a post they have already liked"
    },
    INVALID_UNLIKE: {
        status: 400,
        message: "User cannot unlike a post they have not liked"
    },
    INVALID_FOLLOW: {
        status: 400,
        message: "User cannot follow a user they currently follow"
    },
    INVALID_UNFOLLOW: {
        status: 400,
        message: "User cannot unfollow a user they do not currently follow"
    },
    POST_DOES_NOT_EXIST: {
        status: 404,
        message: "Post does not exist"
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
    },
    SPOTIFY_API_ERROR: {
        status: 500,
        message: "An error occurred when reaching out to Spotify"
    },
    SPOTIFY_FAILED_CONNECTION: {
        status: 500,
        message: "An error occurred when attempting to connect to the Spotify API"
    }
};

module.exports = {
    errorNames,
    errorTypes
};