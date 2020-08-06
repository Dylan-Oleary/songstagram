const { Post, User } = require("../schema/models");
const { errorNames } = require("../config/errors");
const { validateEmail } = require("../lib/validation");

const UserService = {
    editUser: (id, updatedUser) => {
        const invalidFields = [
            "followers",
            "following",
            "isDeleted",
            "_id",
            "createdAt",
            "updatedAt",
            "password"
        ];

        invalidFields.forEach(field => {
            if(updatedUser[field]) throw new Error(errorNames.INVALID_FIELDS);
        });

        if(updatedUser.email){
            if(!validateEmail(updatedUser.email)) throw new Error(errorNames.INVALID_EMAIL);
        }

        return User.findOne({
            $or: [
                { email: updatedUser.email || ""},
                { username: updatedUser.username || "" }
            ]
        }).then(existingUser => {
            if(existingUser){
                let errors = [];

                ["email","username"].forEach(key => {
                    if(existingUser[key] === updatedUser[key]) errors.push(key);
                });

                if(errors.length > 1){
                    throw new Error(errorNames.USERNAME_AND_EMAIL_TAKEN);
                } else if(errors.indexOf("email") != -1){
                    throw new Error(errorNames.EMAIL_ALREADY_TAKEN);
                } else if(errors.indexOf("username") != -1){
                    throw new Error(errorNames.USERNAME_ALREADY_TAKEN);
                } else {
                    throw new Error(errorNames.BAD_REQUEST);
                }
            } else {
                return User.findById(id).then(foundUser => {
                    if(foundUser && foundUser._id.toString() === id.toString()){
                        return User.findByIdAndUpdate(id, updatedUser, {
                            new: true,
                            runValidators: true
                        }).catch(error => {
                            console.error(error);
                            throw new Error(errorNames.SERVER_ERROR);
                        });
                    } else {
                        throw new Error(errorNames.INVALID_USER);
                    }
                }).catch(error => {
                    console.error(error);
                    throw new Error(errorNames.SERVER_ERROR);
                });
            }
        }).catch(error => {
            throw new Error(errorNames[error.message] || errorNames.SERVER_ERROR);
        });
    },
    deleteUser: (id, req) => {
        return User.findById(id).then(foundUser => {
            if(foundUser && (foundUser._id == id)){
                return Promise.all([
                    User.findByIdAndUpdate(id, { isDeleted: true }, { new: true }),
                    Post.updateMany({ user: id }, { $set: { isDeleted: true }}, { new: true })
                ]).then(([ deletedUser ]) => {
                    req.session.destroy(error => {
                        if(error) throw new Error(errorNames.SERVER_ERROR);
                    });

                    return deletedUser;
                }).catch(error => {
                    console.error(error);
                    throw new Error(errorNames.SERVER_ERROR);
                });
            } else {
                throw new Error(errorNames.INVALID_USER);
            }
        }).catch(error => {
            console.error(error);
            throw new Error(errorNames.SERVER_ERROR);
        });
    },
    getUsers: (userIDs = [], options) => {
        if(userIDs.length > 0){
            const queryOptions = {
                cursorIndex: options.cursorIndex || 0,
                sort: options.sort || { createdAt: "desc" },
                limit: options.limit || 20,
                isDeleted: options.isDeleted || false
            };

            return User.find({ _id: { $in: userIDs }, isDeleted: queryOptions.isDeleted })
                .sort(queryOptions.sort)
                .skip(queryOptions.cursorIndex * queryOptions.limit)
                .limit(queryOptions.limit)
                .then(users => {
                    return users;
                })
                .catch(error => {
                    console.error(error);
                    throw new Error(errorNames.SERVER_ERROR);
                });
        } else {
            return [];
        }
    },
    getUserByID: id => {
        return User.findById(id).catch(error => {
            console.error(error);
            throw new Error(errorNames.SERVER_ERROR);
        });
    },
    followUser: (userID, userToFollowID) => {
        return User.findById(userToFollowID).then(userToFollow => {
            if(userToFollow && userToFollow._id == userToFollowID){
                const matchingUser = userToFollow.followers.find(follower => follower._id == userID);

                if(!matchingUser){
                    return Promise.all([
                        User.findByIdAndUpdate(
                            userID,
                            { $push: { following: userToFollowID } },
                            { new: true, runValidators: true }
                        ),
                        User.findByIdAndUpdate(
                            userToFollowID,
                            { $push: { followers: userID } },
                            { new: true, runValidators: true }
                        )
                    ]).then(([ updatedUser ]) => {
                        return updatedUser;
                    }).catch(error => {
                        console.error(error);
                        throw new Error(errorNames.SERVER_ERROR);
                    });
                } else {
                    throw new Error(errorNames.INVALID_FOLLOW);
                }
            } else {
                throw new Error(errorNames.INVALID_USER);
            }
        }).catch(error => {
            console.error(error);
            throw new Error(errorNames.SERVER_ERROR);
        });
    },
    unfollowUser: (userID, userToUnfollowID) => {
        return User.findById(userToUnfollowID).then(userToUnfollow => {
            if(userToUnfollow && userToUnfollow._id == userToUnfollowID){
                const matchingUser = userToUnfollow.followers.find(follower => follower._id == userID);

                if(matchingUser){
                    return Promise.all([
                        User.findByIdAndUpdate(
                            userID,
                            { $pull: { following: userToUnfollowID } },
                            { new: true, runValidators: true }
                        ),
                        User.findByIdAndUpdate(
                            userToUnfollowID,
                            { $pull: { followers: userID } },
                            { new: true, runValidators: true }
                        )
                    ]).then(([ updatedUser ]) => {
                        return updatedUser;
                    }).catch(error => {
                        console.error(error);
                        throw new Error(errorNames.SERVER_ERROR);
                    });
                } else {
                    throw new Error(errorNames.INVALID_UNFOLLOW);
                }
            } else {
                throw new Error(errorNames.INVALID_USER);
            }
        }).catch(error => {
            console.error(error);
            throw new Error(errorNames.SERVER_ERROR);
        });
    }
};

module.exports = UserService;