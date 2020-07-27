const { Comment } = require("../schema/models");
const { errorNames } = require("../config/errors");

const CommentService = {
    addReplyToComment: (replyID, commentID) => {
        return Comment.findByIdAndUpdate(commentID, { $push: { replies: replyID } }).catch(error => {
            console.error(error);
            throw new Error(errorNames.SERVER_ERROR);
        });
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
                if(parentComment.post == postID) return;

                throw new Error(errorNames.BAD_REQUEST);
            }).catch(error => {
                console.error(error);
                throw new Error(errorNames.SERVER_ERROR);
            });

            return newComment.save().catch(error => {
                console.error(error);
                throw new Error(errorNames.SERVER_ERROR);
            });
        } catch(error){
            throw new Error(error);
        }
    },
    getComments: (options, sort) => {
        return Comment.find(options)
            .sort(sort)
            .then(comments => comments)
            .catch(error => {
                console.error(error);
                throw new Error(errorNames.SERVER_ERROR);
            });
    },
    getCommentByID: commentID => {
        return Comment.findById(commentID).catch(error => {
            console.error(error);
            throw new Error(errorNames.SERVER_ERROR);
        });
    },
    getCommentReplies: (commentID, postID) => {
        return Comment.find({ parentComment: commentID, post: postID }).catch(error => {
            console.error(error);
            throw new Error(errorNames.SERVER_ERROR);
        });
    }
};

module.exports = CommentService;