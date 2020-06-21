const cors = require('../middlewares/cors')
const jsonParse = require('../middlewares/json-parse')
const contentType = require('../middlewares/content-type')
module.exports = app => {
  app.disable('x-powered-by')
  app.use(cors)
  app.use(jsonParse)
  app.use(contentType)
}
