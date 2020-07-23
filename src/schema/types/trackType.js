/* eslint-disable no-empty-pattern */
const graphql = require("graphql");
const {
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString
} = graphql;

// Services
const SpotifyService = require("../../services/spotify");

const TrackType = new GraphQLObjectType({
    name: "TrackType",
    fields: () => {
        const ArtistType = require("./artistType");
        const AlbumType = require("./albumType");

        return {
            id: { type: GraphQLID },
            name: { type: GraphQLString },
            artists: {
                type: new GraphQLList(ArtistType),
                resolve({ artists }, {}, req){
                    const artistIDs = artists.map(artist => artist.id);

                    return SpotifyService.getArtists(artistIDs, req);
                }
            },
            album: {
                type: AlbumType,
                resolve({ album }, {}, req){
                    return SpotifyService.getAlbum(album.id, req);
                }
            },
            duration_ms: { type: GraphQLInt },
            popularity: { type: GraphQLInt },
            uri: { type: GraphQLString },
            type: { type: GraphQLString }
        };
    }
});

module.exports = TrackType;