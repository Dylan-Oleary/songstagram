const graphql = require("graphql");
const { GraphQLObjectType } = graphql;

// Mutations
const PostMutations = require("./post");
const UserMutations = require("./user");

module.exports = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        // Post Mutations
        createPost: PostMutations.createPost,
        editPost: PostMutations.editPost,
        deletePost: PostMutations.deletePost,
        addCommentToPost: PostMutations.addCommentToPost,
        addLikeToPost: PostMutations.addLikeToPost,
        removeLikeFromPost: PostMutations.removeLikeFromPost,
        // User Mutations
        editUser: UserMutations.editUser,
        deleteUser: UserMutations.deleteUser,
        loginUser: UserMutations.loginUser,
        logoutUser: UserMutations.logoutUser,
        registerUser: UserMutations.registerUser,
        followUser: UserMutations.followUser,
        unfollowUser: UserMutations.unfollowUser
    }
});