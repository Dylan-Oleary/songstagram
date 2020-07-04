const axios = require("axios");
const qs = require("qs");
const authorization = `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;

const SpotifyService = {
    webToken: {},
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