const { User } = require("../schema/models");

const AuthenticationService = {
    registerUser: (user) => {
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
                return newUser.save();
            }
        });
    }
};

module.exports = AuthenticationService;