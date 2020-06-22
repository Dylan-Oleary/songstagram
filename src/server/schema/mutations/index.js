const graphql = require("graphql");
const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString
} = graphql;

// Types
const UserType = require("../types/userType");

// Services
const AuthenticationService = require("../../services/authentication");

module.exports = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        registerUser: {
            type: UserType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                lastName: { type: new GraphQLNonNull(GraphQLString) },
                username: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
                confirmPassword: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, args){
                const newUser = {
                    firstName: args.firstName,
                    lastName: args.lastName,
                    username: args.username,
                    email: args.email,
                    password: args.password,
                    confirmPassword: args.confirmPassword
                };

                return AuthenticationService.registerUser(newUser);
            }
        }
    }
});