const graphql = require("graphql");
const {
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString
} = graphql;

// Types
const ArtistType = require("./artistType");
const AlbumType = require("./albumType");
const CommentType = require("./commentType");
const PostType = require("./postType");
const SearchType = require("./searchType");
const TrackType = require("./trackType");
const UserType = require("./userType");

// Services
const CommentService = require("../../services/comment");
const PostService = require("../../services/post");
const SpotifyService = require("../../services/spotify");
const UserService = require("../../services/user");

module.exports = new GraphQLObjectType({
    name: "RootQueryType",
    fields: () => ({
        // Users
        user: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                postCursorIndex: { type: GraphQLInt },
                followerCursorIndex: { type: GraphQLInt },
                followingCursorIndex: {type: GraphQLInt }
            },
            resolve(parentValue, { id, postCursorIndex, followerCursorIndex, followingCursorIndex }){
                return UserService.getUserByID(id).then(user => {
                    user.cursorIndex = postCursorIndex;
                    user.followerCursorIndex = followerCursorIndex;
                    user.followingCursorIndex = followingCursorIndex;

                    return user;
                });
            }
        },
        users: {
            type: new GraphQLList(UserType),
            args: {
                userIDs: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) }
            },
            resolve(parentValue, { userIDs }){
                return UserService.getUsers(userIDs);
            }
        },
        // Posts
        post: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parentValue, { id }){
                return PostService.getPostByID(id);
            }
        },
        postComments: {
            type: new GraphQLList(CommentType),
            args: {
                postID: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parentValue, { postID }){
                return PostService.getPostParentComments(postID);
            }
        },
        // Comments
        comment: {
            type: CommentType,
            args: {
                commentID: { type: new GraphQLNonNull(GraphQLID) },
                postID: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parentValue, { commentID }){
                return CommentService.getCommentByID(commentID);
            }
        },
        // Artists
        artist: {
            type: ArtistType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parentValue, { id }, req){
                return SpotifyService.getArtist(id, req);
            }
        },
        artists: {
            type: new GraphQLList(ArtistType),
            args: {
                artistIDs: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) }
            },
            resolve(parentValue, { artistIDs }, req){
                return SpotifyService.getArtists(artistIDs, req);
            }
        },
        // Albums
        album: {
            type: AlbumType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parentValue, { id }, req){
                return SpotifyService.getAlbum(id, req);
            }
        },
        albums: {
            type: new GraphQLList(AlbumType),
            args: {
                albumIDs: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) }
            },
            resolve(parentValue, { albumIDs }, req){
                return SpotifyService.getAlbums(albumIDs, req);
            }
        },
        // Tracks
        track: {
            type: TrackType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parentValue, { id }, req){
                return SpotifyService.getTrack(id, req);
            }
        },
        tracks: {
            type: new GraphQLList(TrackType),
            args: {
                trackIDs: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) }
            },
            resolve(parentValue, { trackIDs }, req){
                return SpotifyService.getTracks(trackIDs, req);
            }
        },
        search: {
            type: SearchType,
            args: {
                query: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, { query }, req){
                return SpotifyService.search(query, req);
            }
        }
    })
});