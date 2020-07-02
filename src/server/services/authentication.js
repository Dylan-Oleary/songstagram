const { User } = require("../schema/models");

const AuthenticationService = {
    loginUser: (user, req) => {
        const { email, password } = user;

        if(!req.session.user){
            return User.findOne({ email }).then(foundUser => {
                if(!foundUser) throw new Error("Email is invalid");

                return new Promise((resolve, reject) => {
                    foundUser.authenticate(password, (error, isMatch) => {
                        if(isMatch) {
                            resolve({
                                id: foundUser._id,
                                email: foundUser.email,
                                username: foundUser.username
                            });
                        } else {
                            if (error) reject(error);

                            reject(new Error({
                                status: 401,
                                message: "Invalid credentials"
                            }));
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
            throw new Error("User is already logged in");
        }
    },
    logoutUser: (user, req) => {
        const { email } = user;

        if(req.session.user){
            return User.findOne({ email }).then(foundUser => {
                if(!foundUser) throw new Error("Email is invalid");

                if(
                    req.session.user.id == foundUser._id &&
                    req.session.user.email === foundUser.email &&
                    req.session.user.username === foundUser.username
                ) {
                    req.session.destroy(error => {
                        if(error) throw error;
                    });

                    return true;
                } else {
                    throw new Error("Session details do not match found user");
                }
            });
        } else {
            throw new Error("User is not logged in");
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

            [
                "firstName",
                "lastName",
                "username",
                "email",
                "password"
            ].forEach(key => {
                if(!newUser[key]) throw new Error("You are missing some required fields");
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

                    throw {
                        errors
                    };
                } else {
                    return newUser.save().then(registeredUser => {
                        req.session.user = {
                            id: registeredUser._id,
                            email: registeredUser.email,
                            username: registeredUser.username
                        };

                        return registeredUser;
                    });
                }
            });
        } else {
            throw new Error("You are already logged in");
        }
    }
};

module.exports = AuthenticationService;