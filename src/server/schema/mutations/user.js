const graphql = require("graphql");
const {
    GraphQLID,
    GraphQLNonNull,
    GraphQLString
} = graphql;

// Types
const UserType = require("../types/userType");

// Services
const UserService = require("../../services/user");
const AuthenticationService = require("../../services/authentication");

const UserMutations = {
    editUser: {
        type: UserType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            firstName: { type: GraphQLString },
            lastName: { type: GraphQLString },
            username: { type: GraphQLString },
            bio: { type: GraphQLString },
            email: { type: GraphQLString }
        },
        resolve(parentValue, args){
            const { id } = args;
            delete args.id;

            return UserService.editUser(id, args);
        }
    },
    deleteUser: {
        type: UserType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve(parentValue, { id }){
            return UserService.deleteUser(id);
        }
    },
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
};

module.exports = UserMutations;