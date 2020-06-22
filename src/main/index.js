const app = require('./config/app')
const MongoHelper = require('../infra/helpers/mongo-helper')
const env = require('./config/env')

MongoHelper.connect(env.mongoUrl).then(() => {
  app.listen(3333, () => {
    console.log('Server is running')
  })
}).catch(console.error)
