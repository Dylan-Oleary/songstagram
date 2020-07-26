const { User } = require("../schema/models");
const { errorNames } = require("../config/errors");

const AuthenticationService = {
    loginUser: (user, req) => {
        const { email, password } = user;

        if(!req.session.user){
            return User.findOne({ email }).then(foundUser => {
                if(!foundUser) throw new Error(errorNames.USER_DOES_NOT_EXIST);

                return new Promise((resolve, reject) => {
                    foundUser.authenticate(password, (error, isMatch) => {
                        if(isMatch) {
                            resolve({
                                id: foundUser._id,
                                email: foundUser.email,
                                username: foundUser.username
                            });
                        } else {
                            if (error) reject(new Error(errorNames.SERVER_ERROR));

                            reject(new Error(errorNames.INVALID_CREDENTIALS));
                        }
                    });
                }).then(authenticatedUser => {
                    req.session.user = authenticatedUser;

                    return true;
                }).catch(error => {
                    throw error;
                });
            });
        } else {
            throw new Error(errorNames.USER_ALREADY_LOGGED_IN);
        }
    },
    logoutUser: (user, req) => {
        const { email } = user;

        if(req.session.user){
            return User.findOne({ email }).then(foundUser => {
                if(!foundUser) throw new Error(errorNames.USER_DOES_NOT_EXIST);

                if(
                    req.session.user.id == foundUser._id &&
                    req.session.user.email === foundUser.email &&
                    req.session.user.username === foundUser.username
                ) {
                    req.session.destroy(error => {
                        if(error) throw new Error(errorNames.SERVER_ERROR);
                    });

                    return true;
                } else {
                    throw new Error(errorNames.INVALID_CREDENTIALS);
                }
            });
        } else {
            throw new Error(errorNames.INVALID_CREDENTIALS);
        }
    },
    registerUser: (user, req) => {
        if(!req.session.user){
            const newUser = new User({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                password: user.password,
                confirmPassword: user.confirmPassword
            });

            if(newUser.password !== newUser.confirmPassword) throw new Error(errorNames.PASSWORDS_DO_NOT_MATCH);

            [
                "firstName",
                "lastName",
                "username",
                "email",
                "password"
            ].forEach(key => {
                if(!newUser[key]) throw new Error(errorNames.MISSING_REQUIRED_FIELDS);
            });

            return User.findOne({
                $or: [
                    { email: newUser.email },
                    { username: newUser.username }
                ]
            }).then(existingUser => {
                if(existingUser){
                    let errors = [];

                    ["email","username"].forEach(key => {
                        if(existingUser[key] === newUser[key]) errors.push(key);
                    });

                    if(errors.length > 1){
                        throw new Error(errorNames.USERNAME_AND_EMAIL_TAKEN);
                    } else if(errors.indexOf("email") != -1){
                        throw new Error(errorNames.EMAIL_ALREADY_TAKEN);
                    } else if(errors.indexOf("username") != -1){
                        throw new Error(errorNames.USERNAME_ALREADY_TAKEN);
                    } else {
                        throw new Error(errorNames.BAD_REQUEST);
                    }
                } else {
                    return newUser.save().then(registeredUser => {
                        req.session.user = {
                            id: registeredUser._id,
                            email: registeredUser.email,
                            username: registeredUser.username
                        };

                        return registeredUser;
                    }).catch(error => {
                        console.error(error);

                        throw new Error(errorNames.SERVER_ERROR);
                    });
                }
            });
        } else {
            throw new Error(errorNames.USER_ALREADY_LOGGED_IN);
        }
    }
};

module.exports = AuthenticationService;