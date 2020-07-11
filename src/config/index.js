const mongoose = require("mongoose");
const SpotifyService = require("../services/spotify");

const connectToMongo = async () => await mongoose.connect(process.env.MONGO_URI_DEV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const connectToSpotify = async app => await SpotifyService.getWebToken(app);

module.exports = {
    connectToMongo,
    connectToSpotify
};