const { errorTypes } = require("../config/errors");

module.exports = e => {
    const error = errorTypes[e.message];

    return error || e;
};