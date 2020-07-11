const { User } = require("../schema/models");

const UserService = {
    editUser: (id, updatedUser, req) => {
        if(req.session.user && req.session.user.id == id){
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
        } else {
            throw new Error("Invalid credentials");
        }
    },
    deleteUser: (id, req) => {
        if(req.session.user && req.session.user.id == id) {
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
        } else {
            throw new Error("Invalid credentials");
        }
    },
    getUsers: () => {
        return User.find();
    },
    getUserByID: id => {
        return User.findById(id);
    }
};

module.exports = UserService;