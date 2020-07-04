const graphql = require("graphql");
const {
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString
} = graphql;

// Types
const ArtistType = require("./artistType");

module.exports = new GraphQLObjectType({
    name: "TrackType",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        artists: { type: new GraphQLList(ArtistType) },
        duration_ms: { type: GraphQLInt },
        popularity: { type: GraphQLInt },
        uri: { type: GraphQLString }
    })
});