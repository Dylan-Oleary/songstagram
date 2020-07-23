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

const ArtistType = new GraphQLObjectType({
    name: "ArtistType",
    fields: () => {
        const AlbumType = require("./albumType");

        return {
            id: { type: GraphQLID },
            name: { type: GraphQLString },
            albums: {
                type: new GraphQLList(AlbumType),
                resolve({ id: artistID }, {}, req){
                    return SpotifyService.getAlbumsByArtist(artistID, req);
                }
            },
            genres: { type: new GraphQLList(GraphQLString) },
            popularity: { type: GraphQLInt },
            uri: { type: GraphQLString }
        };
    }
});

module.exports = ArtistType;