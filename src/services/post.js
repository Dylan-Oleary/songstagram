const { Post, User } = require("../schema/models");

const PostService = {
    getPostByID: postID => {
        return Post.findById(postID);
    },
    getPostsByUser: (userID, cursorIndex) => {
        const postLimit = 9;

        return Post.find({ user: userID })
            .sort({ createdAt: "desc" })
            .skip(cursorIndex * postLimit)
            .limit(postLimit)
            .then(posts => {
                return posts;
            })
        ;
    },
    createPost: (post, userID) => {
        return User.findById(userID).then(foundUser => {
            if(foundUser && foundUser._id == userID){
                const newPost = new Post({
                    body: post.body,
                    spotifyTrackID: post.spotifyTrackID,
                    user: userID
                });

                return newPost.save().then(newPost => {
                    return newPost;
                });
            } else {
                throw new Error("ID parameter does not match returned user's ID");
            }
        });
    },
    editPost: (post, userID) => {
        return User.findById(userID).then(foundUser => {
            if(foundUser && foundUser._id == userID){
                return Post.findById(post.id).then(foundPost => {
                    if(foundPost.user == userID){
                        const { id, body } = post;
                        const updatedPost = {
                            id,
                            body,
                            isEdited: true
                        };

                        return Post.findByIdAndUpdate(id, updatedPost, {
                            new: true,
                            runValidators: true
                        });
                    } else {
                        throw new Error("You cannot edit another user's post");
                    }
                });
            } else {
                throw new Error("ID parameter does not match returned user's ID");
            }
        });
    },
    deletePost: (postID, userID) => {
        return User.findById(userID).then(foundUser => {
            if(foundUser && foundUser._id == userID){
                return Post.findById(postID).then(foundPost => {
                    if(foundPost.user == userID){
                        return Post.findByIdAndDelete(postID);
                    } else {
                        throw new Error("You cannot delete another user's post");
                    }
                });
            } else {
                throw new Error("ID parameter does not match returned user's ID");
            }
        });
    },
    addLikeToPost: (postID, userID) => {
        return Post.findById(postID).then(foundPost => {
            if(foundPost){
                const currentUserLike = foundPost.likes.find(id => id == userID);

                if(!currentUserLike){
                    return Post.findByIdAndUpdate(postID, { $push: { likes: userID } }, { new: true });
                } else {
                    throw new Error("You cannot like a post that you've already liked");
                }
            } else {
                throw new Error("You cannot like a post that does not exist");
            }
        });
    },
    removeLikeFromPost: (postID, userID) => {
        return Post.findById(postID).then(foundPost => {
            if(foundPost){
                const currentUserLike = foundPost.likes.find(id => id == userID);

                if(currentUserLike){
                    return Post.findByIdAndUpdate(postID, { $pull: { likes: userID } }, { new: true });
                } else {
                    throw new Error("You cannot remove a like from a post that you haven't liked");
                }
            } else {
                throw new Error("You cannot remove a like from a post that does not exist");
            }
        });
    },
    getPostsLikedByUser: userID => {
        return Post.find({ likes: { $in: [ userID ] } });
    }
};

module.exports = PostService;