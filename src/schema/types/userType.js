const graphql = require("graphql");
const {
    GraphQLID,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString
} = graphql;
const { GraphQLDateTime } = require("graphql-iso-date");
const PostService = require("../../services/post");

module.exports = new GraphQLObjectType({
    name: "UserType",
    fields: () => {
        const PostType = require("./postType");

        return {
            id: { type: GraphQLID },
            firstName: { type: GraphQLString },
            lastName: { type: GraphQLString },
            username: { type: GraphQLString },
            bio: { type: GraphQLString },
            email: { type: GraphQLString },
            profilePicture: { type: GraphQLString },
            posts: {
                type: new GraphQLList(PostType),
                resolve({ id, cursorIndex = 0 }){
                    return PostService.getPostsByUser(id, cursorIndex);
                }
            },
            createdAt: { type: GraphQLDateTime },
            updatedAt: { type: GraphQLDateTime }
        };
    }
});