const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    isEdited: {
        type: Boolean,
        default: false
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
}, { timestamps: true });

module.exports = mongoose.model("Comment", CommentSchema);