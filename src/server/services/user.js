const { User } = require("../schema/models");

const UserService = {
    getUsers: () => {
        return User.find();
    },
    getUserByID: id => {
        return User.findById(id);
    }
};

module.exports = UserService;