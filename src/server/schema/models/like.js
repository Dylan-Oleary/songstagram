const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    context: {
        type: String,
        enum: [
            "post",
            "comment"
        ],
        required: true
    }
}, { timestamps: true });

mongoose.model("Like", LikeSchema);