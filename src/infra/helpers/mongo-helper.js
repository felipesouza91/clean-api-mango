const { MongoClient } = require('mongodb')
const { MissingParamError } = require('../../utils/erros')
module.exports = {
  async connect (uri) {
    this.uri = uri
    this.client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    this.db = await this.client.db()
  },

  async disconnect () {
    await this.client.close()
    this.client = null
    this.db = null
  },

  async getCollection (collectionName) {
    if (!collectionName) {
      throw new MissingParamError('collectionName')
    }
    if (!this.client || !this.client.isConnected()) {
      await this.connect(this.uri, this.dbName)
    }
    return this.db.collection(collectionName)
  }

}
