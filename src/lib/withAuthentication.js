module.exports = (req, userID, callback) => {
    if (!userID) throw new Error("Invalid Credentials");

    if(req.session.user && req.session.user.id == userID){
        return callback();
    } else {
        throw new Error("Invalid Credentials");
    }
};