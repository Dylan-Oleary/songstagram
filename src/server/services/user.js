const { User } = require("../schema/models");

const UserService = {
    editUser: (id, updatedUser) => {
        return User.findById(id).then(foundUser => {
            if(foundUser && foundUser._id == id){
                return User.findByIdAndUpdate(id, updatedUser, {
                    new: true,
                    runValidators: true
                });
            } else {
                throw new Error("ID parameter does not match returned user's ID");
            }
        });
    },
    deleteUser: id => {
        return User.findById(id).then(foundUser => {
            if(foundUser && (foundUser._id == id)){
                return User.findByIdAndDelete(id);
            } else {
                throw new Error("ID parameter does not match returned user's ID");
            }
        });
    },
    getUsers: () => {
        return User.find();
    },
    getUserByID: id => {
        return User.findById(id);
    }
};

module.exports = UserService;