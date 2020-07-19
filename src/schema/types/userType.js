/* eslint-disable no-empty-pattern */
const graphql = require("graphql");
const {
    GraphQLID,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString
} = graphql;
const { GraphQLDateTime } = require("graphql-iso-date");
const PostService = require("../../services/post");
const withAuthentication = require("../../lib/withAuthentication");

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
            likes: {
                type: new GraphQLList(PostType),
                resolve({ id }, {}, req){
                    return withAuthentication(req, id, () => PostService.getPostsLikedByUser(id));
                }
            },
            createdAt: { type: GraphQLDateTime },
            updatedAt: { type: GraphQLDateTime }
        };
    }
});