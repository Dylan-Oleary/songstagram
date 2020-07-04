const graphql = require("graphql");
const {
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString
} = graphql;

module.exports = new GraphQLObjectType({
    name: "ArtistType",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genres: { type: new GraphQLList(GraphQLString) },
        popularity: { type: GraphQLInt },
        uri: { type: GraphQLString }
    })
});