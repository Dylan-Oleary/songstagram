/* eslint-disable no-console */
const initializeApp = require("./src");
const app = initializeApp();

app.on("ready", () => {
    app.listen(3000, () => console.log("Application is running"));
});

app.on("fail", () => {
    console.log("Application has failed to start");
    process.exit(1);
});