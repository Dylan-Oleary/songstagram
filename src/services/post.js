const { Post } = require("../schema/models");
const CommentService = require("./comment");
const { errorNames } = require("../config/errors");

const PostService = {
    getPostByID: postID => {
        return Post.findById(postID).catch(error => {
            console.error(error);
            throw new Error(errorNames.SERVER_ERROR);
        });
    },
    getPostsByUser: (userID, options) => {
        const queryOptions = {
            cursorIndex: options.cursorIndex || 0,
            sort: options.sort || { createdAt: "desc" },
            limit: options.limit || 12
        };

        return Post.find({ user: userID })
            .sort(queryOptions.sort)
            .skip(queryOptions.cursorIndex * queryOptions.limit)
            .limit(queryOptions.limit)
            .then(posts => {
                return posts;
            })
            .catch(error => {
                console.error(error);
                throw new Error(errorNames.SERVER_ERROR);
            })
        ;
    },
    createPost: (post, userID) => {
        if(post.spotifyTrackID){
            const newPost = new Post({
                body: post.body,
                spotifyTrackID: post.spotifyTrackID,
                user: userID
            });

            return newPost.save().then(newPost => {
                return newPost;
            }).catch(error => {
                console.error(error);
                throw new Error(errorNames.SERVER_ERROR);
            });
        } else {
            throw new Error(errorNames.EMPTY_SPOTIFY_ID);
        }
    },
    editPost: (post, userID) => {
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
                }).catch(error => {
                    console.error(error);
                    throw new Error(errorNames.SERVER_ERROR);
                });
            } else {
                throw new Error(errorNames.INVALID_CREDENTIALS);
            }
        }).catch(error => {
            console.error(error);
            throw new Error(errorNames.SERVER_ERROR);
        });
    },
    deletePost: (postID, userID) => {
        return Post.findById(postID).then(foundPost => {
            if(foundPost.user == userID){
                return Post.findByIdAndDelete(postID).catch(error => {
                    console.error(error);
                    throw new Error(errorNames.SERVER_ERROR);
                });
            } else {
                throw new Error(errorNames.INVALID_CREDENTIALS);
            }
        }).catch(error => {
            console.error(error);
            throw new Error(errorNames.SERVER_ERROR);
        });
    },
    addLikeToPost: (postID, userID) => {
        return Post.findById(postID).then(foundPost => {
            if(foundPost){
                const currentUserLike = foundPost.likes.find(id => id == userID);

                if(!currentUserLike){
                    return Post.findByIdAndUpdate(postID, { $push: { likes: userID } }, { new: true }).catch(error => {
                        console.error(error);
                        throw new Error(errorNames.SERVER_ERROR);
                    });
                } else {
                    throw new Error(errorNames.INVALID_LIKE);
                }
            } else {
                throw new Error(errorNames.POST_DOES_NOT_EXIST);
            }
        }).catch(error => {
            console.error(error);
            throw new Error(errorNames.SERVER_ERROR);
        });
    },
    removeLikeFromPost: (postID, userID) => {
        return Post.findById(postID).then(foundPost => {
            if(foundPost){
                const currentUserLike = foundPost.likes.find(id => id == userID);

                if(currentUserLike){
                    return Post.findByIdAndUpdate(postID, { $pull: { likes: userID } }, { new: true }).catch(error => {
                        console.error(error);
                        throw new Error(errorNames.SERVER_ERROR);
                    });
                } else {
                    throw new Error(errorNames.INVALID_UNLIKE);
                }
            } else {
                throw new Error(errorNames.POST_DOES_NOT_EXIST);
            }
        }).catch(error => {
            console.error(error);
            throw new Error(errorNames.SERVER_ERROR);
        });
    },
    getPostsLikedByUser: userID => {
        return Post.find({ likes: { $in: [ userID ] } }).catch(error => {
            console.error(error);
            throw new Error(errorNames.SERVER_ERROR);
        });
    },
    addCommentToPost: (postID, userID, comment, parentComment = undefined) => {
        return Post.findById(postID).then(foundPost => {
            if(foundPost){
                return CommentService.createComment(postID, userID, comment, parentComment).then(async newComment => {
                    try {
                        if(parentComment) await CommentService.addReplyToComment(newComment._id, parentComment);

                        return Post.findByIdAndUpdate(postID, { $push: { comments: newComment._id } }, { new: true }).catch(error => {
                            console.error(error);
                            throw new Error(errorNames.SERVER_ERROR);
                        });
                    } catch(error){
                        throw new Error(error);
                    }
                });
            } else {
                throw new Error(errorNames.POST_DOES_NOT_EXIST);
            }
        }).catch(error => {
            console.error(error);
            throw new Error(errorNames.SERVER_ERROR);
        });
    },
    getPostParentComments: postID => {
        return Post.findById(postID).then(foundPost => {
            if(foundPost){
                const postComments = [ ...foundPost.comments ];
                const options = {
                    _id: {
                        $in: postComments
                    },
                    parentComment: null,
                    post: postID
                };
                const sort = {
                    createdAt: "desc"
                };

                return CommentService.getComments(options, sort);
            } else {
                throw new Error(errorNames.POST_DOES_NOT_EXIST);
            }
        }).catch(error => {
            console.error(error);
            throw new Error(errorNames.SERVER_ERROR);
        });
    }
};

module.exports = PostService;