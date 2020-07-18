/* eslint-disable no-empty-pattern */
const graphql = require("graphql");
const {
    GraphQLID,
    GraphQLObjectType
} = graphql;
const { GraphQLDateTime } = require("graphql-iso-date");
const UserService = require("../../services/user");
const PostService = require("../../services/post");

module.exports = new GraphQLObjectType({
    name: "LikeType",
    fields: () => {
        const PostType = require("./postType");
        const UserType = require("./userType");

        return {
            id: { type: GraphQLID },
            post: {
                type: PostType,
                resolve({ post: postID }){
                    return PostService.getPostByID(postID);
                }
            },
            user: {
                type: UserType,
                resolve({ user: userID }){
                    return UserService.getUserByID(userID);
                }
            },
            createdAt: { type: GraphQLDateTime },
            updatedAt: { type: GraphQLDateTime }
        };
    }
});