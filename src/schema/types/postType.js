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
const PostService = require("../../services/post");
const SpotifyService = require("../../services/spotify");
const UserService = require("../../services/user");

const PostType = new GraphQLObjectType({
    name: "PostType",
    fields: () => {
        const CommentType = require("./commentType");
        const TrackType = require("./trackType");
        const UserType = require("./userType");

        return {
            id: { type: GraphQLID },
            body: { type: GraphQLString },
            track: {
                type: TrackType,
                resolve({ spotifyTrackID }, {}, req){
                    return SpotifyService.getTrack(spotifyTrackID, req);
                }
            },
            user: {
                type: UserType,
                resolve({ user: userID }){
                    return UserService.getUserByID(userID);
                }
            },
            comments: {
                type: new GraphQLList(CommentType),
                resolve({ id: postID }){
                    return PostService.getPostParentComments(postID);
                }
            },
            likes: {
                type: new GraphQLList(UserType),
                resolve({ likes: userIDs }){
                    return UserService.getUsers(userIDs);
                }
            },
            isEdited: { type: GraphQLBoolean },
            isDeleted: { type: GraphQLBoolean },
            createdAt: { type: GraphQLDateTime },
            updatedAt: { type: GraphQLDateTime }
        };
    }
});

module.exports = PostType;