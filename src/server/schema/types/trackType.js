const graphql = require("graphql");
const {
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString
} = graphql;
const SpotifyService = require("../../services/spotify");

module.exports = new GraphQLObjectType({
    name: "TrackType",
    fields: () => {
        const ArtistType = require("./artistType");
        const AlbumType = require("./albumType");

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
            album: {
                type: AlbumType,
                resolve({ album }){
                    return SpotifyService.getAlbum(album.id);
                }
            },
            duration_ms: { type: GraphQLInt },
            popularity: { type: GraphQLInt },
            uri: { type: GraphQLString },
            type: { type: GraphQLString }
        };
    }
});