const graphql = require("graphql");
const {
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString
} = graphql;

// Types
const TrackType = require("./trackType");

module.exports = new GraphQLObjectType({
    name: "SearchType",
    fields: () => ({
        query: { type: GraphQLString },
        tracks: { type: new GraphQLList(TrackType) },
        total: { type: GraphQLInt }
    })
});