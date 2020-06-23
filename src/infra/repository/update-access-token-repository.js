
const { MissingParamError } = require('../../utils/erros')
const MongoHelper = require('../helpers/mongo-helper')
module.exports = class UpdateAccessTokenRepository {
  async update (userId, accessToken) {
    if (!userId) {
      throw new MissingParamError('userId')
    }
    if (!accessToken) {
      throw new MissingParamError('accessToken')
    }
    const db = await MongoHelper.getCollection('users')
    await db.updateOne({
      _id: userId
    }, {
      $set: {
        accessToken
      }
    })
  }
}
