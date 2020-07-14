const graphql = require("graphql");
const {
    GraphQLID,
    GraphQLNonNull,
    GraphQLString
} = graphql;

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

            return PostService.createPost(post, userID, req);
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

            return PostService.editPost(post, userID, req);
        }
    },
    deletePost: {
        type: PostType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            userID: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve(parentValue, { id, userID }, req){
            return PostService.deletePost(id, userID, req);
        }
    }
};

module.exports = PostMutations;