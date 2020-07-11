const graphql = require("graphql");
const { GraphQLObjectType } = graphql;

// Mutations
const UserMutations = require("./user");

module.exports = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        editUser: UserMutations.editUser,
        deleteUser: UserMutations.deleteUser,
        loginUser: UserMutations.loginUser,
        logoutUser: UserMutations.logoutUser,
        registerUser: UserMutations.registerUser
    }
});