const graphql = require("graphql");
const {
    GraphQLID,
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull
} = graphql;

// Types
const UserType = require("./userType");

// Services
const UserService = require("../../services/user");

module.exports = new GraphQLObjectType({
    name: "RootQueryType",
    fields: () => ({
        user: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parentValue, { id }) {
                return UserService.getUserByID(id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(){
                return UserService.getUsers();
            }
        }
    })
});