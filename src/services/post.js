const { Post } = require("../schema/models");
const CommentService = require("./comment");

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
        if(post.spotifyTrackID){
            const newPost = new Post({
                body: post.body,
                spotifyTrackID: post.spotifyTrackID,
                user: userID
            });

            return newPost.save().then(newPost => {
                return newPost;
            });
        } else {
            throw new Error("You must pass a Spotify Track ID to create a post");
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
                });
            } else {
                throw new Error("You cannot edit another user's post");
            }
        });
    },
    deletePost: (postID, userID) => {
        return Post.findById(postID).then(foundPost => {
            if(foundPost.user == userID){
                return Post.findByIdAndDelete(postID);
            } else {
                throw new Error("You cannot delete another user's post");
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
    },
    addCommentToPost: (postID, userID, comment, parentComment = undefined) => {
        return Post.findById(postID).then(foundPost => {
            if(foundPost){
                return CommentService.createComment(postID, userID, comment, parentComment).then(async newComment => {
                    try {
                        if(parentComment) await CommentService.addReplyToComment(newComment._id, parentComment);

                        return Post.findByIdAndUpdate(postID, { $push: { comments: newComment._id } }, { new: true });
                    } catch(error){
                        throw new Error(error);
                    }
                });
            } else {
                throw new Error("You cannot add a comment to a post that doesn't exist");
            }
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
                throw new Error("You cannot get comments for a post that does not exist");
            }
        });
    }
};

module.exports = PostService;