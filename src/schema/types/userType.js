/* eslint-disable no-empty-pattern */
const graphql = require("graphql");
const {
    GraphQLBoolean,
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
                resolve({ followers, followerCursorIndex = 0 }){
                    const options = {
                        cursorIndex: followerCursorIndex,
                        sort: { createdAt: "desc" },
                        limit: 20,
                        isDeleted: false
                    };

                    return UserService.getUsers(followers, options);
                }
            },
            following: {
                type: new GraphQLList(UserType),
                resolve({ following, followingCursorIndex = 0 }){
                    const options = {
                        cursorIndex: followingCursorIndex,
                        sort: { createdAt: "desc" },
                        limit: 20,
                        isDeleted: false
                    };

                    return UserService.getUsers(following, options);
                }
            },
            posts: {
                type: new GraphQLList(PostType),
                resolve({ id, postCursorIndex = 0 }){
                    const options = {
                        cursorIndex: postCursorIndex,
                        sort: { createdAt: "desc" },
                        limit: 12,
                        isDeleted: false
                    };

                    return PostService.getPostsByUser(id, options);
                }
            },
            likes: {
                type: new GraphQLList(PostType),
                resolve({ id }, {}, req){
                    return withAuthentication(req, id, () => PostService.getPostsLikedByUser(id));
                }
            },
            createdAt: { type: GraphQLDateTime },
            updatedAt: { type: GraphQLDateTime },
            isDeleted: { type: GraphQLBoolean }
        };
    }
});

module.exports = UserType;