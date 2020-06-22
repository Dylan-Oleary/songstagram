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
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "Like"
    }],
    createdDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

mongoose.model("Comment", CommentSchema);