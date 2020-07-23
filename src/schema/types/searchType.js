const graphql = require("graphql");
const {
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString
} = graphql;

const SearchType = new GraphQLObjectType({
    name: "SearchType",
    fields: () => {
        const TrackType = require("./trackType");

        return {
            query: { type: GraphQLString },
            tracks: { type: new GraphQLList(TrackType) },
            total: { type: GraphQLInt }
        };
    }
});

module.exports = SearchType;