const axios = require("axios");
const qs = require("qs");
const authorization = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;

const SpotifyService = {
    webToken: process.env.NODE_ENV === "production"
        ? {}
        : { access_token: process.env.SPOTIFY_DEV_TOKEN } ,
    getWebToken(){
        const body = { grant_type: "client_credentials" };
        const headers = {
            "Authorization": `Basic ${Buffer.from(authorization).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded"
        };

        return axios.post("https://accounts.spotify.com/api/token", qs.stringify(body), { headers }).then(({ data }) => {
            this.webToken = data;

            return;
        });
    },
    getArtist(artistID){
        const requestConfig = {
            headers: {
                "Authorization": `Bearer ${this.webToken.access_token}`
            }
        };

        return axios.get(`https://api.spotify.com/v1/artists/${artistID}`, requestConfig).then(({ data }) => data);
    },
    getArtists(artistIDs){
        const requestConfig = {
            params: {
                ids: artistIDs.join(",")
            },
            headers: {
                "Authorization": `Bearer ${this.webToken.access_token}`
            }
        };

        return axios.get("https://api.spotify.com/v1/artists", requestConfig).then(({ data }) => data.artists);
    },
    getAlbum(albumID){
        const requestConfig = {
            headers: {
                "Authorization": `Bearer ${this.webToken.access_token}`
            }
        };

        return axios.get(`https://api.spotify.com/v1/albums/${albumID}`, requestConfig).then(({ data }) => data);
    },
    getAlbums(albumIDs){
        const requestConfig = {
            params: {
                ids: albumIDs.join(",")
            },
            headers: {
                "Authorization": `Bearer ${this.webToken.access_token}`
            }
        };


        return axios.get("https://api.spotify.com/v1/albums", requestConfig).then(({ data }) => data.albums);
    },
    getAlbumsByArtist(artistID){
        const requestConfig = {
            headers: {
                "Authorization": `Bearer ${this.webToken.access_token}`
            }
        };

        return axios.get(`https://api.spotify.com/v1/artists/${artistID}/albums`, requestConfig).then(({ data }) => data.items);
    },
    getAlbumTracks(albumID){
        const requestConfig = {
            headers: {
                "Authorization": `Bearer ${this.webToken.access_token}`
            }
        };

        return axios.get(`https://api.spotify.com/v1/albums/${albumID}/tracks`, requestConfig).then(({ data }) => data);
    },
    getTrack(trackID){
        const requestConfig = {
            headers: {
                "Authorization": `Bearer ${this.webToken.access_token}`
            }
        };

        return axios.get(`https://api.spotify.com/v1/tracks/${trackID}`, requestConfig).then(({ data }) => data);
    },
    search(query){
        const requestConfig = {
            params: {
                q: query,
                type: "track",
                limit: 10
            },
            headers: {
                "Authorization": `Bearer ${this.webToken.access_token}`
            }
        };

        return axios.get("https://api.spotify.com/v1/search", requestConfig).then(({ data }) => {
            const { tracks } = data;

            return {
                tracks: tracks.items || [],
                query: query,
                total: tracks.total
            };
        });
    }
};

module.exports = SpotifyService;