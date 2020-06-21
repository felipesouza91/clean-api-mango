const cors = require('../middlewares/cors')
const jsonParse = require('../middlewares/json-parse')
module.exports = app => {
  app.disable('x-powered-by')
  app.use(cors)
  app.use(jsonParse)
}
