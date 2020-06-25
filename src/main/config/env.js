module.exports = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  tokenSecret: process.env.TOKEN_SECRECT || 'tHis@SeC23$ErTK78as##y',
  port: process.env.PORT || 3333
}
