const graphql = require("graphql");
const {
    GraphQLID,
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString
} = graphql;

// Types
const ArtistType = require("./artistType");
const AlbumType = require("./albumType");
const SearchType = require("./searchType");
const TrackType = require("./trackType");
const UserType = require("./userType");

// Services
const SpotifyService = require("../../services/spotify");
const UserService = require("../../services/user");

module.exports = new GraphQLObjectType({
    name: "RootQueryType",
    fields: () => ({
        // Users
        user: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parentValue, { id }){
                return UserService.getUserByID(id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(){
                return UserService.getUsers();
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