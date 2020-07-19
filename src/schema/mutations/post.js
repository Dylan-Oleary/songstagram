const graphql = require("graphql");
const {
    GraphQLID,
    GraphQLNonNull,
    GraphQLString
} = graphql;
const withAuthentication = require("../../lib/withAuthentication");

// Types
const PostType = require("../types/postType");

// Services
const PostService = require("../../services/post");

const PostMutations = {
    createPost: {
        type: PostType,
        args: {
            body: { type: GraphQLString },
            spotifyTrackID: { type: new GraphQLNonNull(GraphQLID) },
            userID: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve(parentValue, { body, spotifyTrackID, userID }, req){
            const post = { body, spotifyTrackID };

            return withAuthentication(req, userID, () => PostService.createPost(post, userID));
        }
    },
    editPost: {
        type: PostType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            body: { type: GraphQLString },
            userID: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve(parentValue, { id, body, userID }, req){
            const post = { id, body };

            return withAuthentication(req, userID, () => PostService.editPost(post, userID));
        }
    },
    deletePost: {
        type: PostType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            userID: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve(parentValue, { id, userID }, req){
            return withAuthentication(req, userID, () => PostService.deletePost(id, userID));
        }
    },
    addLikeToPost: {
        type: PostType,
        args: {
            postID: { type: new GraphQLNonNull(GraphQLID) },
            userID: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve(parentValue, { postID, userID }, req){
            return withAuthentication(req, userID, () => PostService.addLikeToPost(postID, userID));
        }
    },
    removeLikeFromPost: {
        type: PostType,
        args: {
            postID: { type: new GraphQLNonNull(GraphQLID) },
            userID: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve(parentValue, { postID, userID }, req){
            return withAuthentication(req, userID, () => PostService.removeLikeFromPost(postID, userID));
        }
    }
};

module.exports = PostMutations;