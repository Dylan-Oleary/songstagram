const graphql = require("graphql");
const {
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString
} = graphql;
const { GraphQLDateTime } = require("graphql-iso-date");
const SpotifyService = require("../../services/spotify");

module.exports = new GraphQLObjectType({
    name: "AlbumType",
    fields: () => {
        const ArtistType = require("./artistType");
        const TrackType = require("./trackType");

        return {
            id: { type: GraphQLID },
            name: { type: GraphQLString },
            artists: {
                type: new GraphQLList(ArtistType),
                resolve({ artists }){
                    const artistIDs = artists.map(artist => artist.id);

                    return SpotifyService.getArtists(artistIDs);
                }
            },
            tracks: {
                type: new GraphQLList(TrackType),
                resolve({ id: albumID}){
                    return SpotifyService.getAlbumTracks(albumID).then(tracks => tracks.items);
                }
            },
            release_date: { type: GraphQLDateTime },
            genres: { type: new GraphQLList(GraphQLString) },
            label: { type: GraphQLString },
            album_type: { type: GraphQLString },
            type: { type: GraphQLString },
            popularity: { type: GraphQLInt },
            uri: { type: GraphQLString }
        };
    }
});