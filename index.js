/* eslint-disable no-console */
const app = require("./src/server/index");

app.listen(4000, () => {
    console.log("I am listening!");
});