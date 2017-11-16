'use strict';
const http = require('http'),
    path = require('path'),
    express = require('express'),
    app = express(),
    PORT = process.env.PORT || 8080,
    appDir = path.join(__dirname, 'public');

app.use(express.static(appDir));

app.get('*', function (req, res) {
    res.sendFile(path.join(appDir, 'index.html'));
});

http.createServer(app).listen(PORT, function () {
    console.log()
    console.log(`serving ${appDir} at http://localhost:`);
});
