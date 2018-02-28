'use strict'
const path = require('path')
    , morgan = require('morgan')
    , helmet = require('helmet')
    , compression = require('compression')
    , log = require('winston')
    , express = require('express')
    , app = express()
    , PORT = process.env.PORT || 8080
    , appDir = path.join(__dirname, 'dist');

app.use(morgan('tiny')) // logging
app.use(helmet()) // security
app.use(compression()) // compression

// serve static files
app.use(express.static(appDir));

// send index.html for all routes
<<<<<<< HEAD
app.get('*', (req, res) => res.sendFile(path.join(appDir, 'index.html')))
=======
app.get('/', (req, res) => res.sendFile(path.join(appDir, 'index.html')))
>>>>>>> 10e31dc48c4de22d14d6e3cfe8a3f03f2ecc0b83

// start it!
app.listen(PORT, () => log.info(`serving ${appDir} at http://localhost:${PORT}`))
