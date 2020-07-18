const graphql = require("graphql");
const {
    GraphQLID,
    GraphQLNonNull
} = graphql;

// Types
const LikeType = require("../types/likeType");

// Services
const LikesService = require("../../services/likes");

const LikeMutations = {
    addLikeToPost: {
        type: LikeType,
        args: {
            postID: { type: new GraphQLNonNull(GraphQLID) },
            userID: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve(parentValue, { postID, userID }, req){
            return LikesService.addLikeToPost(postID, userID, req);
        }
    },
    deleteLikeFromPost: {
        type: LikeType,
        args: {
            postID: { type: new GraphQLNonNull(GraphQLID) },
            userID: { type: new GraphQLNonNull(GraphQLID) }
        },
        resolve(parentValue, { postID, userID }, req){
            return LikesService.deleteLikeFromPost(postID, userID, req);
        }
    }
};

module.exports = LikeMutations;