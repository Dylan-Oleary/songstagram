const graphql = require("graphql");
const {
    GraphQLBoolean,
    GraphQLID,
    GraphQLNonNull,
    GraphQLString
} = graphql;
const withAuthentication = require("../../lib/withAuthentication");

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

            return withAuthentication(req, id, () => UserService.editUser(id, args));
        }
    },
    deleteUser: {
        type: UserType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve(parentValue, { id }, req){
            return withAuthentication(req, id, () => UserService.deleteUser(id, req));
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
    },
    followUser: {
        type: UserType,
        args: {
            userID: { type: new GraphQLNonNull(GraphQLID) },
            userToFollowID: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve(parentValue, { userID, userToFollowID }, req){
            return withAuthentication(req, userID, () => UserService.followUser(userID, userToFollowID));
        }
    },
    unfollowUser: {
        type: UserType,
        args: {
            userID: { type: new GraphQLNonNull(GraphQLID) },
            userToUnfollowID: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve(parentValue, { userID, userToUnfollowID }, req){
            return withAuthentication(req, userID, () => UserService.unfollowUser(userID, userToUnfollowID));
        }
    }
};

module.exports = UserMutations;