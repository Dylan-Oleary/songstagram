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

// Services
const CommentService = require("../../services/comment");
const UserService = require("../../services/user");

const CommentType = new GraphQLObjectType({
    name: "CommentType",
    fields: () => {
        const UserType = require("./userType");

        return {
            id: { type: GraphQLID },
            body: { type: GraphQLString },
            parentComment: { type: GraphQLID },
            user: {
                type: UserType,
                resolve({ user: userID }){
                    return UserService.getUserByID(userID);
                }
            },
            isEdited: { type: GraphQLBoolean },
            replies: {
                type: new GraphQLList(CommentType),
                resolve({ id: commentID, post: postID }){
                    return CommentService.getCommentReplies(commentID, postID);
                }
            },
            likes: {
                type: new GraphQLList(UserType),
                resolve({ likes: userIDs }){
                    return UserService.getUsers(userIDs);
                }
            },
            createdAt: { type: GraphQLDateTime },
            updatedAt: { type: GraphQLDateTime }
        };
    }
});

module.exports = CommentType;