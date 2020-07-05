require("dotenv").config();
const express = require("express");
const expressGraphQL = require("express-graphql");
const graphQlSchema = require("../server/schema");
const session = require("express-session");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);
const { connectToMongo, connectToSpotify } = require("./config");

const app = express();
const redisClient = redis.createClient();

connectToMongo();
if(process.env.NODE_ENV === "production") connectToSpotify();

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24,
    resave: false,
    saveUninitialized: false
}));

app.use("/graphql", expressGraphQL({
    schema: graphQlSchema,
    graphiql: true
}));

const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

//Initialize webpack configuration
const webpackConfig = require("../../webpack.config");
const compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    noInfo: true,
    stats: "errors-warnings"
}));
app.use(webpackHotMiddleware(compiler));

module.exports = app;