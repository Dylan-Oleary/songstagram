/* eslint-disable no-empty-pattern */
const graphql = require("graphql");
const {
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLObjectType,
    GraphQLString
} = graphql;
const { GraphQLDateTime } = require("graphql-iso-date");

// Services
const SpotifyService = require("../../services/spotify");

const AlbumType = new GraphQLObjectType({
    name: "AlbumType",
    fields: () => {
        const ArtistType = require("./artistType");
        const TrackType = require("./trackType");

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
            tracks: {
                type: new GraphQLList(TrackType),
                resolve({ id: albumID}, {}, req){
                    return SpotifyService.getAlbumTracks(albumID, req).then(tracks => tracks.items);
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

module.exports = AlbumType;