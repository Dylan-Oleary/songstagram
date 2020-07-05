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
            resolve(parentValue, { id }){
                return SpotifyService.getArtist(id);
            }
        },
        artists: {
            type: new GraphQLList(ArtistType),
            args: {
                artistIDs: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) }
            },
            resolve(parentValue, { artistIDs }){
                return SpotifyService.getArtists(artistIDs);
            }
        },
        // Albums
        album: {
            type: AlbumType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parentValue, { id }){
                return SpotifyService.getAlbum(id);
            }
        },
        albums: {
            type: new GraphQLList(AlbumType),
            args: {
                albumIDs: { type: new GraphQLNonNull(new GraphQLList(GraphQLID)) }
            },
            resolve(parentValue, { albumIDs }){
                return SpotifyService.getAlbums(albumIDs);
            }
        },
        // Tracks
        track: {
            type: TrackType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parentValue, { id }){
                return SpotifyService.getTrack(id);
            }
        },
        search: {
            type: SearchType,
            args: {
                query: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parentValue, { query }){
                return SpotifyService.search(query);
            }
        }
    })
});