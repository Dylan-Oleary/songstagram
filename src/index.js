require("dotenv").config();
const express = require("express");
const expressGraphQL = require("express-graphql");
const graphQlSchema = require("./schema");
const session = require("express-session");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);
const redisClient = redis.createClient();
const { connectToMongo, connectToSpotify } = require("./config");

const initializeApp = () => {
    const app = express();

    Promise.all([
        connectToMongo(),
        connectToSpotify(app)
    ]).then(() => {
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

        app.emit("ready");
    }).catch(error => {
        console.error(error);

        app.emit("fail");
    });

    return app;
};

module.exports = initializeApp;