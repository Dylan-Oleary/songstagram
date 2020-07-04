const graphql = require("graphql");
const {
    GraphQLID,
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString
} = graphql;

// Types
const SearchType = require("./searchType");
const UserType = require("./userType");

// Services
const SpotifyService = require("../../services/spotify");
const UserService = require("../../services/user");

module.exports = new GraphQLObjectType({
    name: "RootQueryType",
    fields: () => ({
        search: {
            type: SearchType,
            args: {
                query: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, { query }){
                return SpotifyService.search(query);
            }
        },
        user: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parentValue, { id }){
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