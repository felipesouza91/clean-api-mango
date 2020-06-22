const setRoutes = require('./routes')
const express = require('express')
const app = express()
const setupApp = require('./setup')

setupApp(app)
setRoutes(app)
module.exports = app
