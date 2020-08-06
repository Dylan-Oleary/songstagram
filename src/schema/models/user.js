const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    bio: {
        type: String
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

UserSchema.virtual("confirmPassword")
    .get(() => this.confirmPassword)
    .set(value => this.confirmPassword = value);

UserSchema.pre("save", function(next){
    const user = this;

    if(!user.isModified("password")) return next();

    if(user.password !== user.confirmPassword) throw new Error("Your Passwords Do Not Match");

    bcrypt.hash(user.password, SALT_ROUNDS, (error, hash) => {
        if(error) return next(error);

        user.password = hash;
        next();
    });
});

UserSchema.methods.authenticate = function(plainPassword, callback) {
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
        if(err) return callback(err);
        callback(null, isMatch);
    });
};

module.exports = mongoose.model("User", UserSchema);