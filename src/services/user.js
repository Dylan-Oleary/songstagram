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
    getUsers: (userIDs = [], options) => {
        if(userIDs.length > 0){
            const queryOptions = {
                cursorIndex: options.cursorIndex || 0,
                sort: options.sort || { createdAt: "desc" },
                limit: options.limit || 20
            };

            return User.find({ _id: { $in: userIDs } })
                .sort(queryOptions.sort)
                .skip(queryOptions.cursorIndex * queryOptions.limit)
                .limit(queryOptions.limit)
                .then(users => {
                    return users;
                });
        } else {
            return [];
        }
    },
    getUserByID: id => {
        return User.findById(id);
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
                    });
                } else {
                    throw new Error("You are already following this user");
                }
            } else {
                throw new Error("An error occurred when looking up the user to follow");
            }
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
                    });
                } else {
                    throw new Error("You cannot unfollow a user you are not following");
                }
            } else {
                throw new Error("An error occurred when looking up the user to unfollow");
            }
        });
    }
};

module.exports = UserService;