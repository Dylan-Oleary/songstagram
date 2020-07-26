/* eslint-disable no-empty-pattern */
const graphql = require("graphql");
const {
    GraphQLID,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString
} = graphql;
const { GraphQLDateTime } = require("graphql-iso-date");
const withAuthentication = require("../../lib/withAuthentication");

// Services
const PostService = require("../../services/post");
const UserService = require("../../services/user");

const UserType = new GraphQLObjectType({
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
            followers: {
                type: new GraphQLList(UserType),
                resolve({ followers }){
                    return UserService.getUsers(followers);
                }
            },
            following: {
                type: new GraphQLList(UserType),
                resolve({ following }){
                    return UserService.getUsers(following);
                }
            },
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

module.exports = UserType;