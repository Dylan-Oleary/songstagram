const graphql = require("graphql");
const SpotifyService = require("../../services/spotify");
const {
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString
} = graphql;

module.exports = new GraphQLObjectType({
    name: "ArtistType",
    fields: () => {
        const AlbumType = require("./albumType");

        return {
            id: { type: GraphQLID },
            name: { type: GraphQLString },
            albums: {
                type: new GraphQLList(AlbumType),
                resolve({ id: artistID }){
                    return SpotifyService.getAlbumsByArtist(artistID);
                }
            },
            genres: { type: new GraphQLList(GraphQLString) },
            popularity: { type: GraphQLInt },
            uri: { type: GraphQLString }
        };
    }
});