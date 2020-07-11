const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    spotifyId: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "Like"
    }],
    createdDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

mongoose.model("Post", PostSchema);