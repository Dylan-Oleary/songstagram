const graphql = require("graphql");
const {
    GraphQLBoolean,
    GraphQLID,
    GraphQLNonNull,
    GraphQLString
} = graphql;

// Types
const UserType = require("../types/userType");

// Services
const AuthenticationService = require("../../services/authentication");
const UserService = require("../../services/user");

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
        resolve(parentValue, args, req){
            const { id } = args;
            delete args.id;

            return UserService.editUser(id, args, req);
        }
    },
    deleteUser: {
        type: UserType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve(parentValue, { id }, req){
            return UserService.deleteUser(id, req);
        }
    },
    loginUser: {
        type: GraphQLBoolean,
        args: {
            email: { type: new GraphQLNonNull(GraphQLString) },
            password: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve(parentValue, args, req){
            return AuthenticationService.loginUser(args, req);
        }
    },
    logoutUser: {
        type: GraphQLBoolean,
        args: {
            email: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve(parentValue, args, req){
            return AuthenticationService.logoutUser(args, req);
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
        resolve(parentValue, args, req){
            const newUser = {
                firstName: args.firstName,
                lastName: args.lastName,
                username: args.username,
                email: args.email,
                password: args.password,
                confirmPassword: args.confirmPassword
            };

            return AuthenticationService.registerUser(newUser, req);
        }
    }
};

module.exports = UserMutations;