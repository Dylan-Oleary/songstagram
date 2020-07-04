const mongoose = require("mongoose");
const SpotifyService = require("../services/spotify");

const connectToMongo = async () => await mongoose.connect(process.env.MONGO_URI_DEV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).catch(error => {
    console.error(`Error Connecting to MongoDB: ${error}`);
    process.exit(1);
});

const connectToSpotify = async () => await SpotifyService.getWebToken().catch(error => {
    console.error(`Error Connecting to Spotify: ${error}`);
    process.exit(1);
});

module.exports = {
    connectToMongo,
    connectToSpotify
};