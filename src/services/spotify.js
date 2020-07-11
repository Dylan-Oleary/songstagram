const axios = require("axios");
const qs = require("qs");
const ms = require("ms");
const authorization = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
const spotifyWebHeaders = "spotifyWebHeaders";

const SpotifyService = {
    getWebToken(app){
        const body = { grant_type: "client_credentials" };
        const headers = {
            "Authorization": `Basic ${Buffer.from(authorization).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded"
        };

        if(process.NODE_ENV === "production"){
            return axios.post("https://accounts.spotify.com/api/token", qs.stringify(body), { headers }).then(({ data }) => {
                app.set("spotifyWebToken", data.access_token);
                app.set(spotifyWebHeaders, { "Authorization": `Bearer ${data.access_token}` });

                setTimeout(() => {
                    console.info("Refreshing Spotify Web Token");
                    this.getWebToken(app).catch(error => {
                        console.error(error);
                        //Send to Error reporting
                    });
                }, ms(process.env.SPOTIFY_TOKEN_REFRESH));

                return;
            });
        } else {
            app.set("spotifyWebToken", process.env.SPOTIFY_DEV_TOKEN);
            app.set(spotifyWebHeaders, { "Authorization": `Bearer ${process.env.SPOTIFY_DEV_TOKEN}` });
        }

    },
    getArtist(artistID, req){
        return axios.get(`https://api.spotify.com/v1/artists/${artistID}`, {
            headers: req.app.get(spotifyWebHeaders)
        }).then(({ data }) => data);
    },
    getArtists(artistIDs, req){
        return axios.get("https://api.spotify.com/v1/artists", {
            params: {
                ids: artistIDs.join(",")
            },
            headers: req.app.get(spotifyWebHeaders)
        }).then(({ data }) => data.artists);
    },
    getAlbum(albumID, req){
        return axios.get(`https://api.spotify.com/v1/albums/${albumID}`, {
            headers: req.app.get(spotifyWebHeaders)
        }).then(({ data }) => data);
    },
    getAlbums(albumIDs, req){
        return axios.get("https://api.spotify.com/v1/albums", {
            params: {
                ids: albumIDs.join(",")
            },
            headers: req.app.get(spotifyWebHeaders)
        }).then(({ data }) => data.albums);
    },
    getAlbumsByArtist(artistID, req){
        return axios.get(`https://api.spotify.com/v1/artists/${artistID}/albums`, {
            headers: req.app.get(spotifyWebHeaders)
        }).then(({ data }) => data.items);
    },
    getAlbumTracks(albumID, req){
        return axios.get(`https://api.spotify.com/v1/albums/${albumID}/tracks`, {
            headers: req.app.get(spotifyWebHeaders)
        }).then(({ data }) => data);
    },
    getTrack(trackID, req){
        return axios.get(`https://api.spotify.com/v1/tracks/${trackID}`, {
            headers: req.app.get(spotifyWebHeaders)
        }).then(({ data }) => data);
    },
    search(query, req){
        return axios.get("https://api.spotify.com/v1/search", {
            params: {
                q: query,
                type: "track",
                limit: 10
            },
            headers: req.app.get(spotifyWebHeaders)
        }).then(({ data }) => {
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