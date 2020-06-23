const MongoHelp = require('./mongo-helper')
const { MissingParamError } = require('../../utils/erros')
describe('Mongo Helper', () => {
  beforeAll(async () => {
    await MongoHelp.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelp.disconnect()
  })

  test('Should reconnect when getCollection is invoked and client is disconnected', async () => {
    const sut = MongoHelp
    expect(sut.db).toBeTruthy()
    await sut.disconnect()
    expect(sut.db).toBeFalsy()
    await sut.getCollection('users')
    expect(sut.db).toBeTruthy()
  })

  test('Should throw if no collectionName is provided', async () => {
    const sut = MongoHelp
    await sut.db
    await expect(sut.getCollection()).rejects.toThrow(new MissingParamError('collectionName'))
  })
})
