const graphql = require("graphql");
const { GraphQLObjectType } = graphql;

// Mutations
const LikeMutations = require("./like");
const PostMutations = require("./post");
const UserMutations = require("./user");

module.exports = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        // Like Mutations
        addLikeToPost: LikeMutations.addLikeToPost,
        deleteLikeFromPost: LikeMutations.deleteLikeFromPost,
        // Post Mutations
        createPost: PostMutations.createPost,
        editPost: PostMutations.editPost,
        deletePost: PostMutations.deletePost,
        // User Mutations
        editUser: UserMutations.editUser,
        deleteUser: UserMutations.deleteUser,
        loginUser: UserMutations.loginUser,
        logoutUser: UserMutations.logoutUser,
        registerUser: UserMutations.registerUser
    }
});