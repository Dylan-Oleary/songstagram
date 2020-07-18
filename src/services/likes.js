const { Like, Post, User } = require("../schema/models");

const LikesService = {
    addLikeToPost: (postID, userID, req) => {
        if(req.session.user && req.session.user.id == userID){
            return Post.findById(postID).then(foundPost => {
                if(foundPost && foundPost._id){
                    return Like.findOne({
                        $and: [
                            { user: userID },
                            { post: postID }
                        ]
                    }).then(foundLike => {
                        if(!foundLike){
                            const newLike = new Like({
                                user: userID,
                                post: postID
                            });

                            return newLike.save().then(createdLike => {
                                return Promise.all([
                                    Post.updateOne({ _id: postID }, { $push: { likes: createdLike._id } }),
                                    User.updateOne({ _id: userID }, { $push: { likedPosts: createdLike._id } })
                                ]).then(() => {
                                    return createdLike;
                                });
                            });
                        } else {
                            throw new Error("You've already liked this post");
                        }
                    });
                } else {
                    throw new Error("You cannot like a post that does not exist");
                }
            });
        } else {
            throw new Error("You cannot like a post if you are not logged in");
        }
    },
    deleteLikeFromPost: (postID, userID, req) => {
        if(req.session.user && req.session.user.id == userID){
            return Post.findById(postID).then(foundPost => {
                if(foundPost && foundPost._id){
                    return Like.findOne({
                        $and: [
                            { user: userID },
                            { post: postID }
                        ]
                    }).then(foundLike => {
                        if(foundLike){
                            return Like.findByIdAndDelete(foundLike._id).then(deletedLike => {
                                return Promise.all([
                                    Post.updateOne({ _id: postID }, { $pull: { likes: deletedLike._id } }),
                                    User.updateOne({ _id: userID }, { $pull: { likedPosts: deletedLike._id } })
                                ]).then(() => {
                                    return deletedLike;
                                });
                            });
                        } else {
                            throw new Error("You cannot remove a like from a post that you have not liked");
                        }
                    });
                } else {
                    throw new Error("You cannot remove a like from a post that does not exist");
                }
            });
        } else {
            throw new Error("You cannot remove a like from a post if you are not logged in");
        }
    },
    getLikesByPostID: postID => {
        return Like.find({ post: postID });
    },
    getLikesByUserID: userID => {
        return Like.find({ user: userID });
    }
};

module.exports = LikesService;