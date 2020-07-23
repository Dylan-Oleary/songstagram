const { Comment } = require("../schema/models");

const CommentService = {
    addReplyToComment: (replyID, commentID) => {
        return Comment.findByIdAndUpdate(commentID, { $push: { replies: replyID } });
    },
    createComment: async (postID, userID, comment, parentCommentID = undefined) => {
        const newComment = new Comment({
            body: comment,
            user: userID,
            post: postID,
            parentComment: parentCommentID
        });

        try {
            if(parentCommentID) await Comment.findById(parentCommentID).then(parentComment => {
                if(parentComment) return;

                throw new Error("You cannot add a parent comment that doesn't exist");
            });

            return newComment.save();
        } catch(error){
            throw new Error(error);
        }
    },
    getComments: (options, sort) => {
        return Comment.find(options)
            .sort(sort)
            .then(comments => comments);
    },
    getCommentByID: commentID => {
        return Comment.findById(commentID);
    },
    getCommentReplies: (commentID, postID) => {
        return Comment.find({ parentComment: commentID, post: postID });
    }
};

module.exports = CommentService;