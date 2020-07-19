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
    deleteUser: (id, req) => {
        return User.findById(id).then(foundUser => {
            if(foundUser && (foundUser._id == id)){
                return User.findByIdAndDelete(id).then(deletedUser => {
                    req.session.destroy(error => {
                        if(error) throw error;
                    });

                    return deletedUser;
                });
            } else {
                throw new Error("ID parameter does not match returned user's ID");
            }
        });
    },
    getUsers: (userIDs = []) => {
        if(userIDs.length > 0){
            return User.find({
                _id: { $in: userIDs }
            });
        } else {
            throw new Error("You must pass in at least one user ID");
        }
    },
    getUserByID: id => {
        return User.findById(id);
    }
};

module.exports = UserService;