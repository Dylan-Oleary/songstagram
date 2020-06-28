const graphql = require("graphql");
const { GraphQLObjectType } = graphql;

// Mutations
const UserMutations = require("./user");

module.exports = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        editUser: UserMutations.editUser,
        deleteUser: UserMutations.deleteUser,
        registerUser: UserMutations.registerUser
    }
});