'use strict';
const http = require("http"),
    path = require("path"),
    express = require("express"),
    app = express(),
    PORT = process.env.PORT || 8080,
    appDir = path.resolve(__dirname, "public");

app.use(express.static(appDir));

app.get("*", function (req, res) {
    res.sendFile(path.resolve(appDir, "index.html"));
});

http.createServer(app).listen(PORT, function () {
    console.log("Express server listening on port " + PORT);
    console.log("http://localhost:" + PORT);
});
