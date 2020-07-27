const { errorNames } = require("../config/errors");

module.exports = (req, userID, callback) => {
    if (!userID) throw new Error(errorNames.INVALID_CREDENTIALS);

    if(req.session.user && req.session.user.id == userID){
        return callback();
    } else {
        throw new Error(errorNames.INVALID_CREDENTIALS);
    }
};